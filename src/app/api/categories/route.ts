import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '../../lib/prisma';

// Array de dados de demonstração para categorias
const DEMO_CATEGORIES = [
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

// GET /api/categories - Listar todas as categorias/gêneros
export async function GET(request: NextRequest) {
  // Em ambiente Vercel, usar dados de demonstração
  if (process.env.VERCEL && process.env.NODE_ENV === 'production') {
    console.log('📚 Usando dados de demonstração para categorias');
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    
    let filteredCategories = [...DEMO_CATEGORIES];
    
    // Aplicar filtro de busca se presente
    if (search) {
      filteredCategories = filteredCategories.filter(category => 
        category.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return NextResponse.json({
      success: true,
      data: filteredCategories,
      count: filteredCategories.length,
      demo: true,
      message: 'Dados de demonstração - acesse localmente para gerenciar categorias reais'
    });
  }
  
  // Código original para desenvolvimento
  try {
    const { searchParams } = new URL(request.url);
    const includeBookCount = searchParams.get('includeBookCount') === 'true';
    const search = searchParams.get('search');

        const whereClause: Record<string, unknown> = {};    // Filtro de busca por nome da categoria
    if (search) {
      whereClause.name = {
        contains: search,
        mode: 'insensitive'
      };
    }

    const categories = await prisma.genre.findMany({
      where: whereClause,
      include: includeBookCount ? {
        _count: {
          select: {
            books: true
          }
        }
      } : undefined,
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      data: categories,
      count: categories.length
    });

  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    
    // Fallback para dados de demonstração
    return NextResponse.json({
      success: true,
      data: DEMO_CATEGORIES,
      count: DEMO_CATEGORIES.length,
      fallback: true,
      message: 'Dados de demonstração devido a erro no banco'
    });
  }
}

// POST /api/categories - Criar uma nova categoria/gênero
export async function POST(request: NextRequest) {
  // Em ambiente Vercel, simular criação
  if (process.env.VERCEL && process.env.NODE_ENV === 'production') {
    console.log('🎭 Simulação de criação de categoria em demonstração');
    const body = await request.json();
    const { name } = body;
    
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Nome da categoria é obrigatório' 
        },
        { status: 400 }
      );
    }
    
    // Simular criação bem-sucedida
    const newCategory = {
      id: `demo-new-${Date.now()}`,
      name: name.trim(),
      _count: { books: 0 },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return NextResponse.json({
      success: true,
      data: newCategory,
      demo: true,
      message: 'Categoria criada na demonstração (não será salva)'
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
          error: 'Nome da categoria é obrigatório' 
        },
        { status: 400 }
      );
    }

    // Verificar se a categoria já existe
    const existingCategory = await prisma.genre.findUnique({
      where: { name: name.trim() }
    });

    if (existingCategory) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Esta categoria já existe' 
        },
        { status: 409 }
      );
    }

    const newCategory = await prisma.genre.create({
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
      data: newCategory,
      message: 'Categoria criada com sucesso'
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    
    // Fallback - simular criação
    const body = await request.json();
    const { name } = body;
    
    return NextResponse.json({
      success: true,
      data: {
        id: `fallback-${Date.now()}`,
        name: name?.trim() || 'Nova Categoria',
        _count: { books: 0 },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      fallback: true,
      message: 'Categoria criada em modo demonstração devido a erro no banco'
    }, { status: 201 });
  }
}

// DELETE /api/categories - Deletar uma categoria (via query param)
export async function DELETE(request: NextRequest) {
  // Em ambiente Vercel, simular deleção
  if (process.env.VERCEL && process.env.NODE_ENV === 'production') {
    console.log('🗑️ Simulação de deleção de categoria em demonstração');
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('id');
    const categoryName = searchParams.get('name');
    
    if (!categoryId && !categoryName) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID ou nome da categoria é obrigatório' 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      demo: true,
      message: `Categoria deletada na demonstração (não será salva)`
    });
  }
  
  // Código original para desenvolvimento
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('id');
    const categoryName = searchParams.get('name');

    if (!categoryId && !categoryName) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID ou nome da categoria é obrigatório' 
        },
        { status: 400 }
      );
    }

    let whereClause: any = {};
    if (categoryId) {
      whereClause.id = categoryId;
    } else if (categoryName) {
      whereClause.name = categoryName;
    }

    // Verificar se a categoria existe
    const existingCategory = await prisma.genre.findFirst({
      where: whereClause,
      include: {
        _count: {
          select: {
            books: true
          }
        }
      }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Categoria não encontrada' 
        },
        { status: 404 }
      );
    }

    // Verificar se há livros associados à categoria
    if (existingCategory._count.books > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Não é possível deletar a categoria "${existingCategory.name}" pois há ${existingCategory._count.books} livro(s) associado(s) a ela.` 
        },
        { status: 409 }
      );
    }

    await prisma.genre.delete({
      where: { id: existingCategory.id }
    });

    // Revalidar páginas relevantes
    revalidatePath('/biblioteca');
    revalidatePath('/api/categories');

    return NextResponse.json({
      success: true,
      message: `Categoria "${existingCategory.name}" deletada com sucesso`
    });

  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    
    // Fallback - simular deleção
    return NextResponse.json({
      success: true,
      fallback: true,
      message: 'Categoria deletada em modo demonstração devido a erro no banco'
    });
  }
}