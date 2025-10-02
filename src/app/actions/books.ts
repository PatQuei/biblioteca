'use server';

import { revalidatePath } from 'next/cache';
import prisma from '../lib/prisma';

// Server Action para criar um novo livro
export async function createBook(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const genreId = formData.get('genreId') as string;
    const year = formData.get('year') as string;
    const pages = formData.get('pages') as string;
    const rating = formData.get('rating') as string;
    const synopsis = formData.get('synopsis') as string;
    const cover = formData.get('cover') as string;
    const status = formData.get('status') as string || 'QUERO_LER';
    const isbn = formData.get('isbn') as string;
    const notes = formData.get('notes') as string;

    // Validações básicas
    if (!title || !author || !genreId) {
      throw new Error('Título, autor e gênero são obrigatórios');
    }

    // Verificar se o gênero existe
    const genreExists = await prisma.genre.findUnique({
      where: { id: genreId }
    });

    if (!genreExists) {
      throw new Error('Gênero não encontrado');
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
        status: status,
        currentPage: 0,
        isbn: isbn?.trim() || null,
        notes: notes?.trim() || null
      }
    });

    // Revalidar as páginas que mostram livros
    revalidatePath('/biblioteca');
    revalidatePath('/');

    return { 
      success: true, 
      data: newBook,
      message: 'Livro criado com sucesso!' 
    };

  } catch (error) {
    console.error('Erro ao criar livro:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro interno do servidor' 
    };
  }
}

// Server Action para atualizar um livro
export async function updateBook(bookId: string, formData: FormData) {
  try {
    // Verificar se o livro existe
    const existingBook = await prisma.book.findUnique({
      where: { id: bookId }
    });

    if (!existingBook) {
      throw new Error('Livro não encontrado');
    }

    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const genreId = formData.get('genreId') as string;
    const year = formData.get('year') as string;
    const pages = formData.get('pages') as string;
    const rating = formData.get('rating') as string;
    const synopsis = formData.get('synopsis') as string;
    const cover = formData.get('cover') as string;
    const status = formData.get('status') as string;
    const currentPage = formData.get('currentPage') as string;
    const isbn = formData.get('isbn') as string;
    const notes = formData.get('notes') as string;

    // Se genreId foi fornecido, verificar se existe
    if (genreId) {
      const genreExists = await prisma.genre.findUnique({
        where: { id: genreId }
      });

      if (!genreExists) {
        throw new Error('Gênero não encontrado');
      }
    }

    // Preparar dados para atualização (apenas campos fornecidos)
    const updateData: Record<string, any> = {};
    
    if (title) updateData.title = title.trim();
    if (author) updateData.author = author.trim();
    if (genreId) updateData.genreId = genreId;
    if (year) updateData.year = parseInt(year);
    if (pages) updateData.pages = parseInt(pages);
    if (rating) updateData.rating = parseInt(rating);
    if (synopsis !== undefined) updateData.synopsis = synopsis.trim();
    if (cover !== undefined) updateData.cover = cover.trim();
    if (status) updateData.status = status;
    if (currentPage) updateData.currentPage = parseInt(currentPage);
    if (isbn !== undefined) updateData.isbn = isbn.trim() || null;
    if (notes !== undefined) updateData.notes = notes.trim() || null;

    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: updateData
    });

    // Revalidar as páginas que mostram livros
    revalidatePath('/biblioteca');
    revalidatePath(`/biblioteca/${bookId}`);
    revalidatePath('/');

    return { 
      success: true, 
      data: updatedBook,
      message: 'Livro atualizado com sucesso!' 
    };

  } catch (error) {
    console.error('Erro ao atualizar livro:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro interno do servidor' 
    };
  }
}

// Server Action para deletar um livro
export async function deleteBook(bookId: string) {
  try {
    // Verificar se o livro existe
    const existingBook = await prisma.book.findUnique({
      where: { id: bookId }
    });

    if (!existingBook) {
      throw new Error('Livro não encontrado');
    }

    await prisma.book.delete({
      where: { id: bookId }
    });

    // Revalidar as páginas que mostram livros
    revalidatePath('/biblioteca');
    revalidatePath('/');

    return { 
      success: true, 
      message: 'Livro deletado com sucesso!' 
    };

  } catch (error) {
    console.error('Erro ao deletar livro:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro interno do servidor' 
    };
  }
}

// Server Action para criar um novo gênero
export async function createGenre(formData: FormData) {
  try {
    const name = formData.get('name') as string;

    // Validação básica
    if (!name || name.trim() === '') {
      throw new Error('Nome do gênero é obrigatório');
    }

    // Verificar se o gênero já existe
    const existingGenre = await prisma.genre.findUnique({
      where: { name: name.trim() }
    });

    if (existingGenre) {
      throw new Error('Este gênero já existe');
    }

    const newGenre = await prisma.genre.create({
      data: {
        name: name.trim()
      }
    });

    // Revalidar páginas relevantes
    revalidatePath('/biblioteca');
    revalidatePath('/api/categories');

    return { 
      success: true, 
      data: newGenre,
      message: 'Gênero criado com sucesso!' 
    };

  } catch (error) {
    console.error('Erro ao criar gênero:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro interno do servidor' 
    };
  }
}

// Server Action para deletar um gênero
export async function deleteGenre(genreId: string) {
  try {
    // Verificar se o gênero existe
    const existingGenre = await prisma.genre.findUnique({
      where: { id: genreId },
      include: {
        _count: {
          select: {
            books: true
          }
        }
      }
    });

    if (!existingGenre) {
      throw new Error('Gênero não encontrado');
    }

    // Verificar se há livros associados ao gênero
    if (existingGenre._count.books > 0) {
      throw new Error(`Não é possível deletar o gênero "${existingGenre.name}" pois há ${existingGenre._count.books} livro(s) associado(s) a ele.`);
    }

    await prisma.genre.delete({
      where: { id: genreId }
    });

    // Revalidar páginas relevantes
    revalidatePath('/biblioteca');
    revalidatePath('/api/categories');

    return { 
      success: true, 
      message: `Gênero "${existingGenre.name}" deletado com sucesso!` 
    };

  } catch (error) {
    console.error('Erro ao deletar gênero:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro interno do servidor' 
    };
  }
}

// Server Action para atualizar o progresso de leitura
export async function updateReadingProgress(bookId: string, currentPage: number) {
  try {
    const book = await prisma.book.findUnique({
      where: { id: bookId }
    });

    if (!book) {
      throw new Error('Livro não encontrado');
    }

    // Determinar o status baseado no progresso
    let newStatus = book.status;
    if (currentPage >= book.pages && book.pages > 0) {
      newStatus = 'LIDO';
    } else if (currentPage > 0 && newStatus === 'QUERO_LER') {
      newStatus = 'LENDO';
    }

    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: {
        currentPage,
        status: newStatus
      }
    });

    // Revalidar as páginas que mostram livros
    revalidatePath('/biblioteca');
    revalidatePath(`/biblioteca/${bookId}`);

    return { 
      success: true, 
      data: updatedBook,
      message: 'Progresso atualizado com sucesso!' 
    };

  } catch (error) {
    console.error('Erro ao atualizar progresso:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro interno do servidor' 
    };
  }
}

// Server Action para alterar status de um livro
export async function updateBookStatus(bookId: string, status: string) {
  try {
    const book = await prisma.book.findUnique({
      where: { id: bookId }
    });

    if (!book) {
      throw new Error('Livro não encontrado');
    }

    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: { status: status }
    });

    // Revalidar as páginas que mostram livros
    revalidatePath('/biblioteca');
    revalidatePath(`/biblioteca/${bookId}`);

    return { 
      success: true, 
      data: updatedBook,
      message: 'Status atualizado com sucesso!' 
    };

  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro interno do servidor' 
    };
  }
}