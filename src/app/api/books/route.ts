import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '../../lib/prisma';

// GET /api/books - Listar todos os livros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const genre = searchParams.get('genre');
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    let whereClause: any = {};

    // Filtro de busca por título ou autor
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Filtro por gênero
    if (genre) {
      whereClause.genre = {
        name: { equals: genre, mode: 'insensitive' }
      };
    }

    // Filtro por status
    if (status) {
      whereClause.status = status;
    }

    const books = await prisma.book.findMany({
      where: whereClause,
      include: {
        genre: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit ? parseInt(limit) : undefined,
      skip: offset ? parseInt(offset) : undefined
    });

    return NextResponse.json({
      success: true,
      data: books,
      count: books.length
    });

  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor ao buscar livros' 
      },
      { status: 500 }
    );
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

    const newBook = await prisma.book.create({
      data: {
        title,
        author,
        genreId,
        year: year ? parseInt(year) : new Date().getFullYear(),
        pages: pages ? parseInt(pages) : 0,
        rating: rating ? parseInt(rating) : 0,
        synopsis: synopsis || '',
        cover: cover || '',
        status,
        currentPage: currentPage ? parseInt(currentPage) : 0,
        isbn,
        notes
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
        error: 'Erro interno do servidor ao criar livro' 
      },
      { status: 500 }
    );
  }
}