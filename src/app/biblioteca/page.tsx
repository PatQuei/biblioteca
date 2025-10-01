import { BookCard, type Book } from "../../components/components/book-card";
import { Filters } from "../../components/components/filters";
import { SearchBar } from "../../components/components/search-bar";

// Dados de exemplo - agora usando o tipo 'Book' importado
const mockBooks: Book[] = [
  { id: '1', title: 'A Revolução dos Bichos', author: 'George Orwell', cover: 'https://placehold.co/300x400/7c3aed/white?text=Livro+1', rating: 5, status: 'LIDO', pages: 128, currentPage: 128 },
  { id: '2', title: 'O Senhor dos Anéis', author: 'J.R.R. Tolkien', cover: 'https://placehold.co/300x400/f97316/white?text=Livro+2', rating: 5, status: 'LENDO', pages: 1216, currentPage: 500 },
  { id: '3', title: 'Duna', author: 'Frank Herbert', cover: 'https://placehold.co/300x400/16a34a/white?text=Livro+3', rating: 4, status: 'QUERO_LER', pages: 688, currentPage: 0 },
  { id: '4', title: '1984', author: 'George Orwell', cover: 'https://placehold.co/300x400/dc2626/white?text=Livro+4', rating: 5, status: 'LIDO', pages: 328, currentPage: 328 },
  { id: '5', title: 'O Guia do Mochileiro das Galáxias', author: 'Douglas Adams', cover: 'https://placehold.co/300x400/0ea5e9/white?text=Livro+5', rating: 4, status: 'PAUSADO', pages: 208, currentPage: 50 },
  { id: '6', title: 'Fahrenheit 451', author: 'Ray Bradbury', cover: 'https://placehold.co/300x400/f59e0b/white?text=Livro+6', rating: 4, status: 'QUERO_LER', pages: 256, currentPage: 0 },
];

export default function BibliotecaPage() {
  const books = mockBooks; // Esta linha será substituída pela busca no banco de dados

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Minha Biblioteca</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Gerencie e explore sua coleção de livros.</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <SearchBar placeholder="Buscar por título ou autor..." />
        <Filters />
      </div>

      {books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Nenhum livro encontrado. Tente ajustar sua busca ou filtros.</p>
        </div>
      )}
    </div>
  );
}

