import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '../../../lib/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/books/[id] - Buscar um livro específico
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        genre: true
      }
    });

    if (!book) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Livro não encontrado' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: book
    });

  } catch (error) {
    console.error('Erro ao buscar livro:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor ao buscar livro' 
      },
      { status: 500 }
    );
  }
}

// PUT /api/books/[id] - Atualizar um livro
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();

    // Verificar se o livro existe
    const existingBook = await prisma.book.findUnique({
      where: { id }
    });

    if (!existingBook) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Livro não encontrado' 
        },
        { status: 404 }
      );
    }

    const {
      title,
      author,
      genreId,
      year,
      pages,
      rating,
      synopsis,
      cover,
      status,
      currentPage,
      isbn,
      notes
    } = body;

    // Se genreId foi fornecido, verificar se existe
    if (genreId) {
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
    }

    // Preparar dados para atualização (apenas campos fornecidos)
    const updateData: Record<string, any> = {};
    
    if (title !== undefined) updateData.title = title;
    if (author !== undefined) updateData.author = author;
    if (genreId !== undefined) updateData.genreId = genreId;
    if (year !== undefined) updateData.year = parseInt(year);
    if (pages !== undefined) updateData.pages = parseInt(pages);
    if (rating !== undefined) updateData.rating = parseInt(rating);
    if (synopsis !== undefined) updateData.synopsis = synopsis;
    if (cover !== undefined) updateData.cover = cover;
    if (status !== undefined) updateData.status = status;
    if (currentPage !== undefined) updateData.currentPage = parseInt(currentPage);
    if (isbn !== undefined) updateData.isbn = isbn;
    if (notes !== undefined) updateData.notes = notes;

    const updatedBook = await prisma.book.update({
      where: { id },
      data: updateData,
      include: {
        genre: true
      }
    });

    // Revalidar as páginas que mostram livros
    revalidatePath('/biblioteca');
    revalidatePath(`/biblioteca/${id}`);
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      data: updatedBook,
      message: 'Livro atualizado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao atualizar livro:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor ao atualizar livro' 
      },
      { status: 500 }
    );
  }
}