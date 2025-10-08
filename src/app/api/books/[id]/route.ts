import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '../../../lib/prisma';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// Dados de demonstração para fallback
const DEMO_BOOKS = [
  {
    id: "1",
    title: "Dom Casmurro",
    author: "Machado de Assis",
    genreId: "1",
    year: 1899,
    pages: 256,
    rating: 4,
    synopsis: "Um clássico da literatura brasileira que narra a história de Bentinho e Capitu.",
    cover: "/images/diario_de_um_banana.webp",
    status: "LIDO",
    currentPage: 256,
    isbn: "978-85-254-0123-4",
    notes: "Excelente narrativa sobre ciúme e incerteza.",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    genre: {
      id: "1",
      name: "Literatura Clássica",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01")
    }
  },
  {
    id: "2", 
    title: "O Senhor dos Anéis",
    author: "J.R.R. Tolkien",
    genreId: "2",
    year: 1954,
    pages: 1200,
    rating: 5,
    synopsis: "Uma jornada épica através da Terra Média.",
    cover: "/images/o senhor dos aneis.jpg",
    status: "LENDO",
    currentPage: 450,
    isbn: "978-85-254-4567-8",
    notes: "Obra-prima da fantasia medieval.",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-15"),
    genre: {
      id: "2",
      name: "Fantasia",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01")
    }
  },
  {
    id: "3",
    title: "1984",
    author: "George Orwell", 
    genreId: "3",
    year: 1949,
    pages: 328,
    rating: 5,
    synopsis: "Uma distopia sobre vigilância e controle totalitário.",
    cover: "/images/o_grande_irmao.jpg",
    status: "QUERO_LER",
    currentPage: 0,
    isbn: "978-85-254-7890-1",
    notes: "Livro fundamental sobre distopias modernas.",
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
    genre: {
      id: "3",
      name: "Ficção Científica",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01")
    }
  },
  {
    id: "4",
    title: "As Crônicas de Nárnia",
    author: "C.S. Lewis",
    genreId: "2",
    year: 1950,
    pages: 767,
    rating: 4,
    synopsis: "Uma saga fantástica sobre um mundo mágico acessível através de um guarda-roupa.",
    cover: "/images/narnia.webp",
    status: "PAUSADO",
    currentPage: 320,
    isbn: "978-85-254-1234-5",
    notes: "História encantadora com alegorias religiosas.",
    createdAt: new Date("2024-03-15"),
    updatedAt: new Date("2024-03-20"),
    genre: {
      id: "2",
      name: "Fantasia",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01")
    }
  },
  {
    id: "5",
    title: "Duna",
    author: "Frank Herbert",
    genreId: "3",
    year: 1965,
    pages: 688,
    rating: 5,
    synopsis: "Épico de ficção científica sobre política, religião e ecologia em um planeta desértico.",
    cover: "/images/Duna.jpg",
    status: "LENDO",
    currentPage: 234,
    isbn: "978-85-254-5678-9",
    notes: "Complexa trama política em ambiente futurista.",
    createdAt: new Date("2024-04-01"),
    updatedAt: new Date("2024-04-10"),
    genre: {
      id: "3",
      name: "Ficção Científica",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01")
    }
  }
];

// GET /api/books/[id] - Buscar um livro específico
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Tentar buscar no banco real primeiro
    try {
      const book = await prisma.book.findUnique({
        where: { id },
        include: {
          genre: true
        }
      });

      if (book) {
        return NextResponse.json({
          success: true,
          data: book
        });
      }
    } catch {
      console.log('Banco de dados não disponível, usando dados de demonstração');
    }

    // Fallback: buscar nos dados de demonstração
    const demoBook = DEMO_BOOKS.find(book => book.id === id);
    
    if (demoBook) {
      return NextResponse.json({
        success: true,
        data: demoBook,
        demo: true,
        message: 'Dados de demonstração - modificações não serão salvas'
      });
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Livro não encontrado' 
      },
      { status: 404 }
    );

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
    const { id } = await params;
    const body = await request.json();

    // Tentar atualizar no banco real primeiro
    try {
      // Verificar se o livro existe
      const existingBook = await prisma.book.findUnique({
        where: { id }
      });

      if (existingBook) {
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
        const updateData: Record<string, string | number | null> = {};
        
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
      }
    } catch {
      console.log('Banco de dados não disponível, simulando atualização');
    }

    // Fallback: simular atualização nos dados de demonstração
    const demoBook = DEMO_BOOKS.find(book => book.id === id);
    
    if (demoBook) {
      // Simular atualização (não persiste)
      const updatedDemo = {
        ...demoBook,
        ...body,
        updatedAt: new Date()
      };

      return NextResponse.json({
        success: true,
        data: updatedDemo,
        demo: true,
        message: 'Atualização simulada - dados de demonstração'
      });
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Livro não encontrado' 
      },
      { status: 404 }
    );

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

// DELETE /api/books/[id] - Deletar um livro
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Tentar deletar do banco real primeiro
    try {
      // Verificar se o livro existe
      const existingBook = await prisma.book.findUnique({
        where: { id }
      });

      if (existingBook) {
        await prisma.book.delete({
          where: { id }
        });

        // Revalidar as páginas que mostram livros
        revalidatePath('/biblioteca');
        revalidatePath('/');

        return NextResponse.json({
          success: true,
          message: 'Livro deletado com sucesso!'
        });
      }
    } catch {
      console.log('Banco de dados não disponível, simulando exclusão');
    }

    // Fallback: simular exclusão dos dados de demonstração
    const demoBook = DEMO_BOOKS.find(book => book.id === id);
    
    if (demoBook) {
      return NextResponse.json({
        success: true,
        demo: true,
        message: 'Exclusão simulada - dados de demonstração'
      });
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Livro não encontrado' 
      },
      { status: 404 }
    );

  } catch (error) {
    console.error('Erro ao deletar livro:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor ao deletar livro' 
      },
      { status: 500 }
    );
  }
}