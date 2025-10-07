import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function GET() {
  try {
    console.log('Iniciando busca de estatísticas...');
    
    // Verificar conexão com o banco primeiro
    try {
      await prisma.$connect();
      console.log('Conexão com banco estabelecida');
    } catch (connectionError) {
      console.error('Erro de conexão com banco:', connectionError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Erro de conexão com o banco de dados',
          details: process.env.NODE_ENV === 'development' ? connectionError : undefined
        },
        { status: 500 }
      );
    }

    // Buscar estatísticas gerais
    const [
      totalBooks,
      readingBooks,
      finishedBooks,
      wantToReadBooks,
      pausedBooks,
      abandonedBooks,
      totalPages,
      readPages,
      totalGenres,
      averageRating,
      recentBooks
    ] = await Promise.all([
      // Total de livros
      prisma.book.count(),
      
      // Livros sendo lidos
      prisma.book.count({
        where: { status: 'LENDO' }
      }),
      
      // Livros concluídos
      prisma.book.count({
        where: { status: 'LIDO' }
      }),
      
      // Livros para ler
      prisma.book.count({
        where: { status: 'QUERO_LER' }
      }),
      
      // Livros pausados
      prisma.book.count({
        where: { status: 'PAUSADO' }
      }),
      
      // Livros abandonados
      prisma.book.count({
        where: { status: 'ABANDONADO' }
      }),
      
      // Total de páginas de todos os livros
      prisma.book.aggregate({
        _sum: {
          pages: true
        }
      }),
      
      // Páginas lidas (livros concluídos + progresso atual)
      prisma.book.aggregate({
        _sum: {
          currentPage: true
        },
        where: {
          OR: [
            { status: 'LIDO' },
            { status: 'LENDO' },
            { status: 'PAUSADO' }
          ]
        }
      }),
      
      // Total de gêneros
      prisma.genre.count(),
      
      // Média de avaliações
      prisma.book.aggregate({
        _avg: {
          rating: true
        },
        where: {
          rating: {
            gt: 0
          }
        }
      }),
      
      // Livros recentes (últimos 5 adicionados)
      prisma.book.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          genre: true
        }
      })
    ]);

    console.log('Estatísticas básicas coletadas:', {
      totalBooks,
      totalGenres,
      recentBooksCount: recentBooks.length
    });

    // Calcular estatísticas adicionais
    const finishedBooksData = await prisma.book.findMany({
      where: { status: 'LIDO' },
      select: { pages: true }
    });
    
    const totalReadPages = finishedBooksData.reduce((sum, book) => sum + (book.pages || 0), 0) + (readPages._sum.currentPage || 0);
    
    const readingProgress = totalPages._sum.pages ? 
      Math.round((totalReadPages / totalPages._sum.pages) * 100) : 0;

    // Estatísticas por gênero (com tratamento para banco vazio)
    let genreStats: Array<{
      id: string;
      name: string;
      _count: {
        books: number;
      };
    }> = [];
    try {
      genreStats = await prisma.genre.findMany({
        include: {
          _count: {
            select: {
              books: true
            }
          }
        },
        orderBy: {
          books: {
            _count: 'desc'
          }
        },
        take: 5
      });
    } catch (genreError) {
      console.warn('Erro ao buscar estatísticas de gênero:', genreError);
      genreStats = [];
    }

    // Livros mais bem avaliados (com tratamento para banco vazio)
    let topRatedBooks: Array<{
      id: string;
      title: string;
      author: string;
      rating: number;
      genre: {
        name: string;
      };
    }> = [];
    try {
      topRatedBooks = await prisma.book.findMany({
        where: {
          rating: {
            gt: 0
          }
        },
        orderBy: {
          rating: 'desc'
        },
        take: 5,
        include: {
          genre: true
        }
      });
    } catch (ratingError) {
      console.warn('Erro ao buscar livros mais bem avaliados:', ratingError);
      topRatedBooks = [];
    }

    console.log('Processamento concluído com sucesso');

    const responseData = {
      success: true,
      data: {
        overview: {
          totalBooks: totalBooks || 0,
          readingBooks: readingBooks || 0,
          finishedBooks: finishedBooks || 0,
          wantToReadBooks: wantToReadBooks || 0,
          pausedBooks: pausedBooks || 0,
          abandonedBooks: abandonedBooks || 0,
          totalGenres: totalGenres || 0,
          averageRating: averageRating._avg.rating ? Number(averageRating._avg.rating.toFixed(1)) : 0
        },
        progress: {
          totalPages: totalPages._sum.pages || 0,
          readPages: totalReadPages || 0,
          readingProgress: readingProgress || 0
        },
        recentActivity: recentBooks.map(book => ({
          id: book.id,
          title: book.title,
          author: book.author,
          genre: book.genre.name,
          status: book.status,
          createdAt: book.createdAt
        })),
        topGenres: genreStats.map(genre => ({
          name: genre.name,
          count: genre._count.books
        })),
        topRatedBooks: topRatedBooks.map(book => ({
          id: book.id,
          title: book.title,
          author: book.author,
          rating: book.rating,
          genre: book.genre.name
        }))
      }
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor ao buscar estatísticas',
        details: process.env.NODE_ENV === 'development' ? {
          message: errorMessage,
          stack: errorStack
        } : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}