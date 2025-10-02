import { NextResponse } from 'next/server';
import type { Book } from '@/app/types/book';

// Referência ao array de livros do arquivo principal
// Na prática, isso seria um banco de dados
declare let books: Book[];

// GET /api/books/[id] - Obtém um livro específico
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const book = books.find((b) => String(b.id) === String(params.id));
  
  if (!book) {
    return NextResponse.json(
      { error: 'Livro não encontrado' },
      { status: 404 }
    );
  }

  return NextResponse.json(book);
}

// PUT /api/books/[id] - Atualiza um livro
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json();
  const index = books.findIndex((b) => String(b.id) === String(params.id));

    if (index === -1) {
      return NextResponse.json(
        { error: 'Livro não encontrado' },
        { status: 404 }
      );
    }

    // Validar dados obrigatórios
    if (!updates.title || !updates.author) {
      return NextResponse.json(
        { error: 'Título e autor são obrigatórios' },
        { status: 400 }
      );
    }

    // Atualizar livro
    const updatedBook: Book = {
      ...books[index],
      ...updates,
      updatedAt: new Date(),
    };

    books[index] = updatedBook;

    return NextResponse.json(updatedBook);
  } catch (error) {
    console.error('Erro ao atualizar livro:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar livro' },
      { status: 500 }
    );
  }
}

// DELETE /api/books/[id] - Remove um livro
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const index = books.findIndex((b) => String(b.id) === String(params.id));

  if (index === -1) {
    return NextResponse.json(
      { error: 'Livro não encontrado' },
      { status: 404 }
    );
  }

  books.splice(index, 1);

  return new NextResponse(null, { status: 204 });
}