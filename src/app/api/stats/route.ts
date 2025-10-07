import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

// Dados estáticos para fallback no serverless
const FALLBACK_STATS = {
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
      id: 'sample-1',
      title: 'O Senhor dos Anéis',
      author: 'J.R.R. Tolkien',
      genre: 'Fantasia',
      status: 'LIDO',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 'sample-2',
      title: 'Dom Casmurro',
      author: 'Machado de Assis',
      genre: 'Ficção',
      status: 'LENDO',
      createdAt: new Date('2024-01-10')
    },
    {
      id: 'sample-3',
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
      id: 'sample-1',
      title: 'O Senhor dos Anéis',
      author: 'J.R.R. Tolkien',
      rating: 5,
      genre: 'Fantasia'
    },
    {
      id: 'sample-2',
      title: 'Dom Casmurro',
      author: 'Machado de Assis',
      rating: 4,
      genre: 'Ficção'
    }
  ]
};

export async function GET() {
  console.log('🔍 Iniciando busca de estatísticas...');
  console.log('📊 Environment:', process.env.NODE_ENV);
  console.log('🗄️ Database:', process.env.DATABASE_URL?.substring(0, 30) + '...');
  
  // Em ambiente serverless, usar fallback direto se for produção
  if (process.env.VERCEL && process.env.NODE_ENV === 'production') {
    console.log('🚀 Ambiente Vercel detectado, usando dados de demonstração');
    return NextResponse.json({
      success: true,
      data: FALLBACK_STATS,
      demo: true,
      message: 'Aplicação funcionando! Os dados são demonstrativos. Acesse localmente para usar o banco real.'
    });
  }
  
  // Tentar usar banco real em desenvolvimento
  try {
    const connectionTimeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 3000)
    );
    
    const connectionPromise = prisma.$connect();
    await Promise.race([connectionPromise, connectionTimeout]);
    
    console.log('✅ Conexão com banco estabelecida');
    
    // Verificar se há dados no banco
    const bookCount = await prisma.book.count();
    console.log('📚 Total de livros encontrados:', bookCount);
    
    if (bookCount === 0) {
      console.log('⚠️ Banco vazio, usando dados de demonstração');
      return NextResponse.json({
        success: true,
        data: FALLBACK_STATS,
        demo: true,
        message: 'Dados de demonstração - adicione seus próprios livros!'
      });
    }
    
    // Se há dados, buscar estatísticas reais com timeout rápido
    const statsTimeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Stats timeout')), 5000)
    );
    
    const statsPromise = Promise.all([
      prisma.book.count(),
      prisma.book.count({ where: { status: 'LENDO' } }),
      prisma.book.count({ where: { status: 'LIDO' } }),
      prisma.book.count({ where: { status: 'QUERO_LER' } }),
      prisma.book.count({ where: { status: 'PAUSADO' } }),
      prisma.book.count({ where: { status: 'ABANDONADO' } }),
      prisma.book.aggregate({ _sum: { pages: true } }),
      prisma.book.aggregate({ 
        _sum: { currentPage: true }, 
        where: { OR: [{ status: 'LIDO' }, { status: 'LENDO' }, { status: 'PAUSADO' }] }
      }),
      prisma.genre.count(),
      prisma.book.aggregate({ _avg: { rating: true }, where: { rating: { gt: 0 } } }),
      prisma.book.findMany({ 
        take: 5, 
        orderBy: { createdAt: 'desc' }, 
        include: { genre: true } 
      })
    ]);
    
    const [
      totalBooks, readingBooks, finishedBooks, wantToReadBooks, 
      pausedBooks, abandonedBooks, totalPages, readPages, 
      totalGenres, averageRating, recentBooks
    ] = await Promise.race([statsPromise, statsTimeout]) as [
      number, number, number, number, number, number,
      { _sum: { pages: number | null } },
      { _sum: { currentPage: number | null } },
      number,
      { _avg: { rating: number | null } },
      Array<{ id: string; title: string; author: string; genre: { name: string }; status: string; createdAt: Date }>
    ];
    
    console.log('� Estatísticas reais coletadas com sucesso');
    
    // Calcular estatísticas derivadas
    const finishedBooksData = await prisma.book.findMany({
      where: { status: 'LIDO' },
      select: { pages: true }
    });
    
    const totalReadPages = finishedBooksData.reduce((sum, book) => sum + (book.pages || 0), 0) + (readPages._sum.currentPage || 0);
    const readingProgress = totalPages._sum.pages ? Math.round((totalReadPages / totalPages._sum.pages) * 100) : 0;
    
    // Buscar top gêneros e livros com fallback
    let genreStats: Array<{
      id: string;
      name: string;
      _count: {
        books: number;
      };
    }> = [];
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
      genreStats = await prisma.genre.findMany({
        include: { _count: { select: { books: true } } },
        orderBy: { books: { _count: 'desc' } },
        take: 5
      });
      
      topRatedBooks = await prisma.book.findMany({
        where: { rating: { gt: 0 } },
        orderBy: { rating: 'desc' },
        take: 5,
        include: { genre: true }
      });
    } catch (error) {
      console.warn('⚠️ Erro em queries secundárias:', error);
    }
    
    return NextResponse.json({
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
    });
    
  } catch (error) {
    console.error('💥 Erro na API, usando fallback:', error);
    
    // Retornar dados estáticos em caso de qualquer erro
    return NextResponse.json({
      success: true,
      data: FALLBACK_STATS,
      fallback: true,
      message: 'Dados de demonstração devido a erro no banco'
    });
  } finally {
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.warn('⚠️ Erro ao desconectar:', disconnectError);
    }
  }
}