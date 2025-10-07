import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '../../lib/prisma';

// Dados de demonstração para fallback
const DEMO_BOOKS = [
  {
    id: 'demo-1',
    title: 'O Senhor dos Anéis',
    author: 'J.R.R. Tolkien',
    genre: { id: 'demo-genre-1', name: 'Fantasia' },
    genreId: 'demo-genre-1',
    year: 1954,
    pages: 1216,
    rating: 5,
    synopsis: 'Uma épica jornada através da Terra-média.',
    cover: '/images/o senhor dos aneis.jpg',
    status: 'LIDO',
    currentPage: 1216,
    isbn: '9780547928227',
    notes: 'Obra-prima da literatura fantástica',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'demo-2',
    title: 'Dom Casmurro',
    author: 'Machado de Assis',
    genre: { id: 'demo-genre-2', name: 'Ficção' },
    genreId: 'demo-genre-2',
    year: 1899,
    pages: 256,
    rating: 4,
    synopsis: 'Romance de Machado de Assis sobre ciúme e traição.',
    cover: '',
    status: 'LENDO',
    currentPage: 200,
    isbn: '9788535902773',
    notes: 'Clássico da literatura brasileira',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'demo-3',
    title: 'Orgulho e Preconceito',
    author: 'Jane Austen',
    genre: { id: 'demo-genre-3', name: 'Romance' },
    genreId: 'demo-genre-3',
    year: 1813,
    pages: 432,
    rating: 0,
    synopsis: 'Romance sobre amor e sociedade na Inglaterra do século XIX.',
    cover: '',
    status: 'QUERO_LER',
    currentPage: 0,
    isbn: '9780141439518',
    notes: '',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  }
];

// GET /api/books - Listar todos os livros com filtros avançados
export async function GET(request: NextRequest) {
  // Em ambiente Vercel, usar dados de demonstração
  if (process.env.VERCEL && process.env.NODE_ENV === 'production') {
    console.log('🏠 Usando dados de demonstração para livros');
    const { searchParams } = new URL(request.url);
    
    // Aplicar filtros simples aos dados de demonstração
    let filteredBooks = [...DEMO_BOOKS];
    
    const search = searchParams.get('search');
    if (search) {
      filteredBooks = filteredBooks.filter(book => 
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const status = searchParams.get('status');
    if (status) {
      filteredBooks = filteredBooks.filter(book => book.status === status);
    }
    
    const genre = searchParams.get('genre');
    if (genre) {
      filteredBooks = filteredBooks.filter(book => 
        book.genre.name.toLowerCase() === genre.toLowerCase()
      );
    }
    
    return NextResponse.json({
      success: true,
      data: filteredBooks,
      totalCount: filteredBooks.length,
      stats: {
        total: filteredBooks.length,
        showing: filteredBooks.length,
        page: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
        genreDistribution: filteredBooks.reduce((acc, book) => {
          acc[book.genre.name] = (acc[book.genre.name] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        statusDistribution: filteredBooks.reduce((acc, book) => {
          acc[book.status] = (acc[book.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        averageRating: filteredBooks.reduce((sum, book) => sum + book.rating, 0) / filteredBooks.length,
        averagePages: filteredBooks.reduce((sum, book) => sum + book.pages, 0) / filteredBooks.length,
        yearRange: { min: 1813, max: 1954 }
      },
      demo: true,
      message: 'Dados de demonstração - acesse localmente para usar dados reais'
    });
  }
  
  // Código original para desenvolvimento
  try {
    const { searchParams } = new URL(request.url);
    
    // Parâmetros de busca
    const search = searchParams.get('search');
    const author = searchParams.get('author');
    const genre = searchParams.get('genre');
    const status = searchParams.get('status');
    
    // Parâmetros de range
    const minRating = searchParams.get('minRating');
    const maxRating = searchParams.get('maxRating');
    const minYear = searchParams.get('minYear');
    const maxYear = searchParams.get('maxYear');
    const minPages = searchParams.get('minPages');
    const maxPages = searchParams.get('maxPages');
    
    // Parâmetros de ordenação
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortDir = searchParams.get('sortDir') || 'desc';
    
    // Parâmetros de paginação
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Construir filtros dinâmicos
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: Record<string, any> = {};

    // Filtro de busca por título, autor ou ISBN
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
        { isbn: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Filtro específico por autor
    if (author) {
      whereClause.author = { contains: author, mode: 'insensitive' };
    }

    // Filtro por gênero
    if (genre) {
      whereClause.genre = {
        name: { equals: genre, mode: 'insensitive' }
      };
    }

    // Filtro por status (suporte a múltiplos valores)
    if (status) {
      const statusArray = status.split(',').map(s => s.trim());
      if (statusArray.length === 1) {
        whereClause.status = statusArray[0];
      } else {
        whereClause.status = { in: statusArray };
      }
    }

    // Filtros de range - Avaliação
    if (minRating || maxRating) {
      whereClause.rating = {};
      if (minRating) whereClause.rating.gte = parseInt(minRating);
      if (maxRating) whereClause.rating.lte = parseInt(maxRating);
    }

    // Filtros de range - Ano
    if (minYear || maxYear) {
      whereClause.year = {};
      if (minYear) whereClause.year.gte = parseInt(minYear);
      if (maxYear) whereClause.year.lte = parseInt(maxYear);
    }

    // Filtros de range - Páginas
    if (minPages || maxPages) {
      whereClause.pages = {};
      if (minPages) whereClause.pages.gte = parseInt(minPages);
      if (maxPages) whereClause.pages.lte = parseInt(maxPages);
    }

    // Configurar ordenação
    const validSortFields = ['title', 'author', 'year', 'rating', 'pages', 'createdAt', 'updatedAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortDirection = sortDir === 'asc' ? 'asc' : 'desc';

    // Buscar dados com contagem total
    const [books, totalCount] = await Promise.all([
      prisma.book.findMany({
        where: whereClause,
        include: {
          genre: true
        },
        orderBy: {
          [sortField]: sortDirection
        },
        take: limit,
        skip: offset
      }),
      prisma.book.count({
        where: whereClause
      })
    ]);

    // Calcular estatísticas
    const stats = {
      total: totalCount,
      showing: books.length,
      page,
      totalPages: Math.ceil(totalCount / limit),
      hasNext: page < Math.ceil(totalCount / limit),
      hasPrev: page > 1,
      genreDistribution: {} as Record<string, number>,
      statusDistribution: {} as Record<string, number>,
      averageRating: 0,
      averagePages: 0,
      yearRange: { min: 0, max: 0 }
    };

    // Calcular distribuições e médias se há resultados
    if (books.length > 0) {
      stats.genreDistribution = books.reduce((acc, book) => {
        const genre = book.genre?.name || 'Sem gênero';
        acc[genre] = (acc[genre] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      stats.statusDistribution = books.reduce((acc, book) => {
        acc[book.status] = (acc[book.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      stats.averageRating = books.reduce((sum, book) => sum + (book.rating || 0), 0) / books.length;
      stats.averagePages = books.reduce((sum, book) => sum + (book.pages || 0), 0) / books.length;
      
      const years = books.map(book => book.year).filter(year => year > 0);
      if (years.length > 0) {
        stats.yearRange = {
          min: Math.min(...years),
          max: Math.max(...years)
        };
      }
    }

    return NextResponse.json({
      success: true,
      data: books,
      stats,
      totalCount,
      pagination: {
        page,
        limit,
        totalPages: stats.totalPages,
        hasNext: stats.hasNext,
        hasPrev: stats.hasPrev
      },
      filters: {
        search,
        author,
        genre,
        status,
        rating: { min: minRating, max: maxRating },
        year: { min: minYear, max: maxYear },
        pages: { min: minPages, max: maxPages }
      },
      sorting: {
        field: sortField,
        direction: sortDirection
      }
    });

  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    
    // Fallback para dados de demonstração em caso de erro
    return NextResponse.json({
      success: true,
      data: DEMO_BOOKS,
      totalCount: DEMO_BOOKS.length,
      stats: {
        total: DEMO_BOOKS.length,
        showing: DEMO_BOOKS.length,
        page: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
        genreDistribution: {
          'Fantasia': 1,
          'Ficção': 1,
          'Romance': 1
        },
        statusDistribution: {
          'LIDO': 1,
          'LENDO': 1,
          'QUERO_LER': 1
        },
        averageRating: 3,
        averagePages: 635,
        yearRange: { min: 1813, max: 1954 }
      },
      fallback: true,
      message: 'Dados de demonstração devido a erro no banco'
    });
  }
}

// POST /api/books - Criar um novo livro
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      title,
      author,
      genreId,
      year,
      pages,
      rating,
      synopsis,
      cover,
      status = 'QUERO_LER',
      currentPage = 0,
      isbn,
      notes
    } = body;

    // Validações básicas
    if (!title || !author || !genreId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Título, autor e gênero são obrigatórios' 
        },
        { status: 400 }
      );
    }

    // Verificar se o gênero existe
    const genreExists = await prisma.genre.findUnique({
      where: { id: genreId }
    });

    if (!genreExists) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Gênero não encontrado' 
        },
        { status: 400 }
      );
    }

    // Validações adicionais
    if (rating && (rating < 0 || rating > 5)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Avaliação deve estar entre 0 e 5' 
        },
        { status: 400 }
      );
    }

    if (pages && pages < 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Número de páginas deve ser positivo' 
        },
        { status: 400 }
      );
    }

    if (currentPage && pages && currentPage > pages) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Página atual não pode ser maior que o total de páginas' 
        },
        { status: 400 }
      );
    }

    const newBook = await prisma.book.create({
      data: {
        title: title.trim(),
        author: author.trim(),
        genreId,
        year: year ? parseInt(year) : new Date().getFullYear(),
        pages: pages ? parseInt(pages) : 0,
        rating: rating ? parseInt(rating) : 0,
        synopsis: synopsis?.trim() || '',
        cover: cover?.trim() || '',
        status,
        currentPage: currentPage ? parseInt(currentPage) : 0,
        isbn: isbn?.trim(),
        notes: notes?.trim()
      },
      include: {
        genre: true
      }
    });

    // Revalidar as páginas que mostram livros
    revalidatePath('/biblioteca');
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      data: newBook,
      message: 'Livro criado com sucesso'
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar livro:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor ao criar livro',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}