import React from "react";
import type { Book } from "../types/book";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {book.cover ? (
        <img
          src={book.cover}
          alt={`Capa do livro ${book.title}`}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">Sem capa</span>
        </div>
      )}

      <div className="p-4">
        <h2 className="font-bold text-xl mb-2 truncate" title={book.title}>
          {book.title}
        </h2>
        <p className="text-gray-600 truncate" title={book.author}>
          {book.author}
        </p>
        {book.synopsis && (
          <p className="text-gray-500 text-sm mt-2 line-clamp-2">
            {book.synopsis}
          </p>
        )}
      </div>
    </div>
  );
}
