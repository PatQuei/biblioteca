import { BookCard } from "../../components/components/book-card";
import { Filters } from "../../components/components/filters";
import { SearchBar } from "../../components/components/search-bar";
import prisma from "src/app/lib/prisma";

// Esta página agora é um Server Component que busca dados
export default async function BibliotecaPage() {
  // Busca os livros do banco de dados
  const books = await prisma.book.findMany({
    orderBy: {
      createdAt: 'desc', // Ordena pelos mais recentes
    }
  });

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
          <p className="text-gray-500 dark:text-gray-400">Nenhum livro encontrado. Tente adicionar um livro primeiro!</p>
        </div>
      )}
    </div>
  );
}

