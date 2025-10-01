import Image from 'next/image';
import { Star } from 'lucide-react';

// O "export" aqui é a correção principal.
export type Book = {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
  status: 'QUERO_LER' | 'LENDO' | 'LIDO' | 'PAUSADO' | 'ABANDONADO';
  pages: number;
  currentPage: number;
};

const statusColors = {
  QUERO_LER: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  LENDO: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  LIDO: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  PAUSADO: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  ABANDONADO: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export function BookCard({ book }: { book: Book }) {
  const progress = book.pages > 0 ? (book.currentPage / book.pages) * 100 : 0;
  const statusText = book.status.replace('_', ' ');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-64">
        <Image 
          src={book.cover} 
          alt={`Capa do livro ${book.title}`} 
          layout="fill" 
          objectFit="cover" 
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null; 
            target.src = `https://placehold.co/300x400/cccccc/333333?text=${book.title.charAt(0)}`;
          }}
        />
         <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full ${statusColors[book.status]}`}>
          {statusText}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 dark:text-white truncate" title={book.title}>
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{book.author}</p>
        
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${i < book.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
              fill={i < book.rating ? 'currentColor' : 'none'}
            />
          ))}
        </div>

        {book.status === 'LENDO' && (
          <div>
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
              <span>Progresso</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

