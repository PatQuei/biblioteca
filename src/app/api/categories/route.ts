import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '../../lib/prisma';

// GET /api/categories - Listar todas as categorias/gêneros
export async function GET(request: NextRequest) {
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
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor ao buscar categorias' 
      },
      { status: 500 }
    );
  }
}

// POST /api/categories - Criar uma nova categoria/gênero
export async function POST(request: NextRequest) {
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
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor ao criar categoria' 
      },
      { status: 500 }
    );
  }
}

// DELETE /api/categories - Deletar uma categoria (via query param)
export async function DELETE(request: NextRequest) {
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
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor ao deletar categoria' 
      },
      { status: 500 }
    );
  }
}