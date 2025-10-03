// Interface baseada no schema Prisma
export interface Book {
  id?: string;
  title: string;
  author: string;
  genre?: {
    id: string;
    name: string;
  };
  genreId: string;
  year: number;
  pages: number;
  rating: number;
  synopsis: string;
  cover: string;
  status: BookStatus;
  currentPage: number;
  isbn?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Enum para status do livro
export type BookStatus = 'QUERO_LER' | 'LENDO' | 'LIDO' | 'PAUSADO' | 'ABANDONADO';

// Interface para o formulário (todos os campos opcionais exceto os obrigatórios)
export interface BookFormData {
  title: string;
  author: string;
  genreId: string;
  year?: number;
  pages?: number;
  rating?: number;
  synopsis?: string;
  cover?: string;
  status?: BookStatus;
  currentPage?: number;
  isbn?: string;
  notes?: string;
}

// Interface para gênero
export interface Genre {
  id: string;
  name: string;
}

// Interface para dados de criação do livro
export type CreateBookData = Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'genre'>;

// Interface para dados de atualização do livro
export type UpdateBookData = Partial<Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'genre'>>;
