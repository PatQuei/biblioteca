import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '../../../../lib/prisma';

interface RouteParams {
  params: {
    genre: string;
  };
}

// GET /api/categories/genres/[genre] - Buscar livros de um gênero específico
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { genre } = params;
    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get('includeStats') === 'true';
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    // Buscar o gênero pelo nome (decodificar URL)
    const decodedGenre = decodeURIComponent(genre);
    
    const genreData = await prisma.genre.findUnique({
      where: { name: decodedGenre },
      include: {
        _count: {
          select: {
            books: true
          }
        }
      }
    });

    if (!genreData) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Gênero não encontrado' 
        },
        { status: 404 }
      );
    }

    // Buscar livros do gênero
    let whereClause: any = {
      genreId: genreData.id
    };

    // Filtro por status se fornecido
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

    let response: any = {
      success: true,
      data: {
        genre: genreData,
        books: books,
        count: books.length
      }
    };

    // Incluir estatísticas se solicitado
    if (includeStats) {
      const totalBooks = books.length;
      const readBooks = books.filter(book => book.status === 'LIDO').length;
      const readingBooks = books.filter(book => book.status === 'LENDO').length;
      const wantToReadBooks = books.filter(book => book.status === 'QUERO_LER').length;
      const pausedBooks = books.filter(book => book.status === 'PAUSADO').length;
      const abandonedBooks = books.filter(book => book.status === 'ABANDONADO').length;

      const avgRating = totalBooks > 0 
        ? Math.round((books.reduce((sum, book) => sum + book.rating, 0) / totalBooks) * 10) / 10
        : 0;

      const totalPages = books.reduce((sum, book) => sum + book.pages, 0);
      const readPages = books.reduce((sum, book) => {
        if (book.status === 'LIDO') return sum + book.pages;
        if (book.status === 'LENDO') return sum + book.currentPage;
        return sum;
      }, 0);

      response.data.stats = {
        totalBooks,
        readBooks,
        readingBooks,
        wantToReadBooks,
        pausedBooks,
        abandonedBooks,
        avgRating,
        totalPages,
        readPages,
        readingProgress: totalPages > 0 ? Math.round((readPages / totalPages) * 100) : 0
      };
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Erro ao buscar livros do gênero:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor ao buscar livros do gênero' 
      },
      { status: 500 }
    );
  }
}

// PUT /api/categories/genres/[genre] - Atualizar nome do gênero
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { genre } = params;
    const body = await request.json();
    const { newName } = body;

    // Validação básica
    if (!newName || newName.trim() === '') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Novo nome do gênero é obrigatório' 
        },
        { status: 400 }
      );
    }

    // Buscar o gênero atual pelo nome
    const decodedGenre = decodeURIComponent(genre);
    
    const existingGenre = await prisma.genre.findUnique({
      where: { name: decodedGenre }
    });

    if (!existingGenre) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Gênero não encontrado' 
        },
        { status: 404 }
      );
    }

    // Verificar se o novo nome já existe
    const duplicateGenre = await prisma.genre.findUnique({
      where: { name: newName.trim() }
    });

    if (duplicateGenre && duplicateGenre.id !== existingGenre.id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Já existe um gênero com este nome' 
        },
        { status: 409 }
      );
    }

    const updatedGenre = await prisma.genre.update({
      where: { id: existingGenre.id },
      data: { name: newName.trim() },
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
      data: updatedGenre,
      message: 'Gênero atualizado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao atualizar gênero:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor ao atualizar gênero' 
      },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/genres/[genre] - Deletar um gênero específico
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { genre } = params;

    // Buscar o gênero pelo nome
    const decodedGenre = decodeURIComponent(genre);
    
    const existingGenre = await prisma.genre.findUnique({
      where: { name: decodedGenre },
      include: {
        _count: {
          select: {
            books: true
          }
        }
      }
    });

    if (!existingGenre) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Gênero não encontrado' 
        },
        { status: 404 }
      );
    }

    // Verificar se há livros associados ao gênero
    if (existingGenre._count.books > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Não é possível deletar o gênero "${existingGenre.name}" pois há ${existingGenre._count.books} livro(s) associado(s) a ele.` 
        },
        { status: 409 }
      );
    }

    await prisma.genre.delete({
      where: { id: existingGenre.id }
    });

    // Revalidar páginas relevantes
    revalidatePath('/biblioteca');
    revalidatePath('/api/categories');

    return NextResponse.json({
      success: true,
      message: `Gênero "${existingGenre.name}" deletado com sucesso`
    });

  } catch (error) {
    console.error('Erro ao deletar gênero:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor ao deletar gênero' 
      },
      { status: 500 }
    );
  }
}