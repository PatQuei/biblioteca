import { NextResponse } from 'next/server';

// API de teste que sempre retorna dados de demonstração
export async function GET() {
  console.log('🚀 API de teste ativada');
  
  return NextResponse.json({
    success: true,
    message: 'Sistema funcionando perfeitamente!',
    environment: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL,
    timestamp: new Date().toISOString(),
    data: {
      overview: {
        totalBooks: 3,
        readingBooks: 1,
        finishedBooks: 1,
        wantToReadBooks: 1,
        pausedBooks: 0,
        abandonedBooks: 0,
        totalGenres: 3,
        averageRating: 4.3
      },
      progress: {
        totalPages: 1904,
        readPages: 1472,
        readingProgress: 77
      },
      recentActivity: [
        {
          id: 'demo-1',
          title: 'O Senhor dos Anéis',
          author: 'J.R.R. Tolkien',
          genre: 'Fantasia',
          status: 'LIDO',
          createdAt: new Date('2024-01-15')
        },
        {
          id: 'demo-2',
          title: 'Dom Casmurro',
          author: 'Machado de Assis',
          genre: 'Ficção',
          status: 'LENDO',
          createdAt: new Date('2024-01-10')
        },
        {
          id: 'demo-3',
          title: 'Orgulho e Preconceito',
          author: 'Jane Austen',
          genre: 'Romance',
          status: 'QUERO_LER',
          createdAt: new Date('2024-01-05')
        }
      ],
      topGenres: [
        { name: 'Fantasia', count: 1 },
        { name: 'Ficção', count: 1 },
        { name: 'Romance', count: 1 }
      ],
      topRatedBooks: [
        {
          id: 'demo-1',
          title: 'O Senhor dos Anéis',
          author: 'J.R.R. Tolkien',
          rating: 5,
          genre: 'Fantasia'
        },
        {
          id: 'demo-2',
          title: 'Dom Casmurro',
          author: 'Machado de Assis',
          rating: 4,
          genre: 'Ficção'
        }
      ]
    }
  });
}