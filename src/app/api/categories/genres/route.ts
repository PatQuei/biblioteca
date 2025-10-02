import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '../../../lib/prisma';

// GET /api/categories/genres - Listar todos os gêneros com estatísticas
export async function GET(request: NextRequest) {
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
      const orderByClause = sortBy === 'name' ? { name: order } : { name: 'asc' };

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
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor ao buscar gêneros' 
      },
      { status: 500 }
    );
  }
}

// POST /api/categories/genres - Criar um novo gênero (alternativa à rota categories)
export async function POST(request: NextRequest) {
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
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor ao criar gênero' 
      },
      { status: 500 }
    );
  }
}