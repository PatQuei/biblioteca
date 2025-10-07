import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '../../../lib/prisma';

// Dados de demonstração para fallback
const DEMO_GENRES = [
  {
    id: 'demo-genre-1',
    name: 'Fantasia',
    _count: { books: 1 },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'demo-genre-2',
    name: 'Ficção',
    _count: { books: 1 },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'demo-genre-3',
    name: 'Romance',
    _count: { books: 1 },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'demo-genre-4',
    name: 'Biografia',
    _count: { books: 0 },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'demo-genre-5',
    name: 'Ciência',
    _count: { books: 0 },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// GET /api/categories/genres - Listar todos os gêneros com estatísticas
export async function GET(request: NextRequest) {
  // Em ambiente Vercel, usar dados de demonstração
  if (process.env.VERCEL && process.env.NODE_ENV === 'production') {
    console.log('🍿️ Usando dados de demonstração para gêneros');
    return NextResponse.json({
      success: true,
      data: DEMO_GENRES,
      count: DEMO_GENRES.length,
      demo: true,
      message: 'Dados de demonstração - acesse localmente para gerenciar gêneros reais'
    });
  }
  
  // Código original para desenvolvimento
  try {
    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get('includeStats') === 'true';
    const sortBy = searchParams.get('sortBy') || 'name'; // name, bookCount
    const order = searchParams.get('order') || 'asc'; // asc, desc

    if (sortBy === 'bookCount') {
      // Para ordenar por contagem de livros
      const genres = await prisma.genre.findMany({
        include: {
          _count: {
            select: {
              books: true
            }
          }
        }
      });

      // Ordenar manualmente por contagem de livros
      const sortedGenres = order === 'desc' 
        ? genres.sort((a, b) => b._count.books - a._count.books)
        : genres.sort((a, b) => a._count.books - b._count.books);

      return NextResponse.json({
        success: true,
        data: sortedGenres,
        count: sortedGenres.length
      });

    } else {
      // Ordenação por nome
      const orderByClause = sortBy === 'name' ? { name: order as any } : { name: 'asc' as any };

      const genres = await prisma.genre.findMany({
        include: {
          _count: {
            select: {
              books: true
            }
          }
        },
        orderBy: orderByClause
      });

      return NextResponse.json({
        success: true,
        data: genres,
        count: genres.length
      });
    }

  } catch (error) {
    console.error('Erro ao buscar gêneros:', error);
    
    // Fallback para dados de demonstração
    return NextResponse.json({
      success: true,
      data: DEMO_GENRES,
      count: DEMO_GENRES.length,
      fallback: true,
      message: 'Dados de demonstração devido a erro no banco'
    });
  }
}

// POST /api/categories/genres - Criar um novo gênero (alternativa à rota categories)
export async function POST(request: NextRequest) {
  // Em ambiente Vercel, simular criação
  if (process.env.VERCEL && process.env.NODE_ENV === 'production') {
    console.log('🎆 Simulação de criação de gênero em demonstração');
    const body = await request.json();
    const { name } = body;
    
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Nome do gênero é obrigatório' 
        },
        { status: 400 }
      );
    }
    
    // Simular criação bem-sucedida
    const newGenre = {
      id: `demo-new-${Date.now()}`,
      name: name.trim(),
      _count: { books: 0 },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return NextResponse.json({
      success: true,
      data: newGenre,
      demo: true,
      message: 'Gênero criado na demonstração (não será salvo)'
    }, { status: 201 });
  }
  
  // Código original para desenvolvimento
  try {
    const body = await request.json();
    const { name } = body;

    // Validação básica
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Nome do gênero é obrigatório' 
        },
        { status: 400 }
      );
    }

    // Verificar se o gênero já existe
    const existingGenre = await prisma.genre.findUnique({
      where: { name: name.trim() }
    });

    if (existingGenre) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Este gênero já existe' 
        },
        { status: 409 }
      );
    }

    const newGenre = await prisma.genre.create({
      data: {
        name: name.trim()
      },
      include: {
        _count: {
          select: {
            books: true
          }
        }
      }
    });

    // Revalidar páginas relevantes
    revalidatePath('/biblioteca');
    revalidatePath('/api/categories');

    return NextResponse.json({
      success: true,
      data: newGenre,
      message: 'Gênero criado com sucesso'
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar gênero:', error);
    
    // Fallback - simular criação
    const body = await request.json();
    const { name } = body;
    
    return NextResponse.json({
      success: true,
      data: {
        id: `fallback-${Date.now()}`,
        name: name?.trim() || 'Novo Gênero',
        _count: { books: 0 },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      fallback: true,
      message: 'Gênero criado em modo demonstração devido a erro no banco'
    }, { status: 201 });
  }
}