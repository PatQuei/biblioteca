// Funções helper para chamadas à API REST - substitui Server Actions
import type { BookFormData } from '../types/book';

// Função para criar um novo livro usando API REST
export async function createBookAPI(data: BookFormData) {
  try {
    const bookData = {
      title: data.title.trim(),
      author: data.author.trim(),
      genreId: data.genreId,
      year: data.year || new Date().getFullYear(),
      pages: data.pages || 0,
      rating: data.rating || 0,
      synopsis: data.synopsis?.trim() || '',
      cover: data.cover?.trim() || '',
      status: data.status || 'QUERO_LER',
      currentPage: 0,
      isbn: data.isbn?.trim() || null,
      notes: data.notes?.trim() || null
    };

    const response = await fetch('/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Erro ao criar livro');
    }

    return {
      success: true,
      data: result.data,
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

// Função para atualizar um livro usando API REST
export async function updateBookAPI(bookId: string, data: BookFormData) {
  try {
    const bookData = {
      title: data.title?.trim(),
      author: data.author?.trim(),
      genreId: data.genreId,
      year: data.year,
      pages: data.pages,
      rating: data.rating,
      synopsis: data.synopsis?.trim(),
      cover: data.cover?.trim(),
      status: data.status,
      currentPage: data.currentPage,
      isbn: data.isbn?.trim() || null,
      notes: data.notes?.trim() || null
    };

    const response = await fetch(`/api/books/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Erro ao atualizar livro');
    }

    return {
      success: true,
      data: result.data,
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

// Função para deletar um livro usando API REST
export async function deleteBookAPI(bookId: string) {
  try {
    const response = await fetch(`/api/books/${bookId}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Erro ao deletar livro');
    }

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

// Função para criar um novo gênero usando API REST
export async function createGenreAPI(name: string) {
  try {
    if (!name || name.trim() === '') {
      throw new Error('Nome do gênero é obrigatório');
    }

    const response = await fetch('/api/categories/genres', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: name.trim() }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Erro ao criar gênero');
    }

    return {
      success: true,
      data: result.data,
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

// Função para deletar um gênero usando API REST
export async function deleteGenreAPI(genreId: string) {
  try {
    const response = await fetch(`/api/categories/genres/${genreId}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Erro ao deletar gênero');
    }

    return {
      success: true,
      message: result.message || 'Gênero deletado com sucesso!'
    };

  } catch (error) {
    console.error('Erro ao deletar gênero:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro interno do servidor'
    };
  }
}

// Função para atualizar progresso de leitura usando API REST
export async function updateReadingProgressAPI(bookId: string, currentPage: number) {
  try {
    const response = await fetch(`/api/books/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentPage }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Erro ao atualizar progresso');
    }

    return {
      success: true,
      data: result.data,
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

// Função para atualizar status do livro usando API REST
export async function updateBookStatusAPI(bookId: string, status: string) {
  try {
    const response = await fetch(`/api/books/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Erro ao atualizar status');
    }

    return {
      success: true,
      data: result.data,
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