
import { NextResponse } from 'next/server';
import type { Book } from '@/app/types/book';

// Simular um banco de dados com um array
let books: Book[] = [
  {
    id: '1',
    title: 'O Senhor dos Anéis',
    author: 'J.R.R. Tolkien',
    cover: 'https://m.media-amazon.com/images/I/71ZLavBjpRL._AC_UF1000,1000_QL80_.jpg',
    description: 'Uma jornada épica através da Terra-média',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
];

// GET /api/books - Lista todos ou retorna um livro por id
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    const book = books.find((b) => String(b.id) === String(id));
    if (!book) {
      return NextResponse.json({ error: 'Livro não encontrado' }, { status: 404 });
    }
    return NextResponse.json(book);
  }
  return NextResponse.json(books);
}

// POST /api/books - Cria um novo livro
export async function POST(request: Request) {
  try {
    const book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'> = await request.json();
    if (!book.title || !book.author) {
      return NextResponse.json({ error: 'Título e autor são obrigatórios' }, { status: 400 });
    }
    const newBook: Book = {
      ...book,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    books.push(newBook);
    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar livro:', error);
    return NextResponse.json({ error: 'Erro ao criar livro' }, { status: 500 });
  }
}

// PUT /api/books?id=ID - Atualiza um livro
export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'ID não informado' }, { status: 400 });
  }
  try {
    const updates = await request.json();
    const index = books.findIndex((b) => String(b.id) === String(id));
    if (index === -1) {
      return NextResponse.json({ error: 'Livro não encontrado' }, { status: 404 });
    }
    if (!updates.title || !updates.author) {
      return NextResponse.json({ error: 'Título e autor são obrigatórios' }, { status: 400 });
    }
    const updatedBook: Book = {
      ...books[index],
      ...updates,
      updatedAt: new Date(),
    };
    books[index] = updatedBook;
    return NextResponse.json(updatedBook);
  } catch (error) {
    console.error('Erro ao atualizar livro:', error);
    return NextResponse.json({ error: 'Erro ao atualizar livro' }, { status: 500 });
  }
}

// DELETE /api/books?id=ID - Remove um livro
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'ID não informado' }, { status: 400 });
  }
  const index = books.findIndex((b) => String(b.id) === String(id));
  if (index === -1) {
    return NextResponse.json({ error: 'Livro não encontrado' }, { status: 404 });
  }
  books.splice(index, 1);
  return new NextResponse(null, { status: 204 });
}