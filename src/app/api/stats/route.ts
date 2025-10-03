import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function GET() {
  try {
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

    // Calcular estatísticas adicionais
    const finishedBooksData = await prisma.book.findMany({
      where: { status: 'LIDO' },
      select: { pages: true }
    });
    
    const totalReadPages = finishedBooksData.reduce((sum, book) => sum + (book.pages || 0), 0) + (readPages._sum.currentPage || 0);
    
    const readingProgress = totalPages._sum.pages ? 
      Math.round((totalReadPages / totalPages._sum.pages) * 100) : 0;

    // Estatísticas por gênero
    const genreStats = await prisma.genre.findMany({
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

    // Livros mais bem avaliados
    const topRatedBooks = await prisma.book.findMany({
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

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalBooks,
          readingBooks,
          finishedBooks,
          wantToReadBooks,
          pausedBooks,
          abandonedBooks,
          totalGenres,
          averageRating: averageRating._avg.rating ? Number(averageRating._avg.rating.toFixed(1)) : 0
        },
        progress: {
          totalPages: totalPages._sum.pages || 0,
          readPages: totalReadPages,
          readingProgress
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
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor ao buscar estatísticas' 
      },
      { status: 500 }
    );
  }
}