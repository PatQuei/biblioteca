import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function GET() {
  try {
    console.log('🔍 Iniciando busca de estatísticas...');
    console.log('📊 Environment:', process.env.NODE_ENV);
    console.log('🗄️ Database:', process.env.DATABASE_URL?.substring(0, 30) + '...');
    
    // Verificar conexão com o banco primeiro
    try {
      await prisma.$connect();
      console.log('✅ Conexão com banco estabelecida');
    } catch (connectionError) {
      console.error('❌ Erro de conexão com banco:', connectionError);
      
      // Retornar dados vazios em caso de erro de conexão
      return NextResponse.json({
        success: true,
        data: {
          overview: {
            totalBooks: 0,
            readingBooks: 0,
            finishedBooks: 0,
            wantToReadBooks: 0,
            pausedBooks: 0,
            abandonedBooks: 0,
            totalGenres: 0,
            averageRating: 0
          },
          progress: {
            totalPages: 0,
            readPages: 0,
            readingProgress: 0
          },
          recentActivity: [],
          topGenres: [],
          topRatedBooks: []
        },
        fallback: true,
        message: 'Dados padrão retornados devido a erro de conexão'
      });
    }

    // Primeiro, verificar se há dados no banco
    const hasData = await prisma.book.count();
    console.log('📚 Total de livros encontrados:', hasData);
    
    if (hasData === 0) {
      console.log('⚠️ Banco vazio, retornando estatísticas zeradas');
      return NextResponse.json({
        success: true,
        data: {
          overview: {
            totalBooks: 0,
            readingBooks: 0,
            finishedBooks: 0,
            wantToReadBooks: 0,
            pausedBooks: 0,
            abandonedBooks: 0,
            totalGenres: 0,
            averageRating: 0
          },
          progress: {
            totalPages: 0,
            readPages: 0,
            readingProgress: 0
          },
          recentActivity: [],
          topGenres: [],
          topRatedBooks: []
        },
        empty: true,
        message: 'Banco vazio - adicione alguns livros primeiro'
      });
    }

    // Buscar estatísticas gerais com timeout
    const statsPromise = Promise.all([
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

    // Timeout de 20 segundos para queries
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout nas queries')), 20000);
    });

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
    ] = await Promise.race([statsPromise, timeoutPromise]) as [
      number, number, number, number, number, number,
      { _sum: { pages: number | null } },
      { _sum: { currentPage: number | null } },
      number,
      { _avg: { rating: number | null } },
      Array<{ id: string; title: string; author: string; genre: { name: string }; status: string; createdAt: Date }>
    ];

    console.log('📈 Estatísticas básicas coletadas:', {
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
      console.warn('⚠️ Erro ao buscar estatísticas de gênero:', genreError);
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
      console.warn('⚠️ Erro ao buscar livros mais bem avaliados:', ratingError);
      topRatedBooks = [];
    }

    console.log('✅ Processamento concluído com sucesso');

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
        recentActivity: recentBooks.map((book: { id: string; title: string; author: string; genre: { name: string }; status: string; createdAt: Date }) => ({
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
    console.error('💥 Erro ao buscar estatísticas:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    // Em caso de erro, retornar dados vazios para evitar quebra da interface
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor ao buscar estatísticas',
      data: {
        overview: {
          totalBooks: 0,
          readingBooks: 0,
          finishedBooks: 0,
          wantToReadBooks: 0,
          pausedBooks: 0,
          abandonedBooks: 0,
          totalGenres: 0,
          averageRating: 0
        },
        progress: {
          totalPages: 0,
          readPages: 0,
          readingProgress: 0
        },
        recentActivity: [],
        topGenres: [],
        topRatedBooks: []
      },
      details: process.env.NODE_ENV === 'development' ? {
        message: errorMessage,
        stack: errorStack
      } : undefined
    }, { status: 200 }); // Status 200 para não quebrar o frontend
  } finally {
    await prisma.$disconnect();
  }
}