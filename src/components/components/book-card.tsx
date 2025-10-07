"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Plus, Minus } from "lucide-react";
import { useState } from "react";
import type { Book } from "@prisma/client";
import { updateReadingProgressAPI } from "../../app/lib/api-client";

const statusColors: { [key: string]: string } = {
  QUERO_LER: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  LENDO:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  LIDO: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  PAUSADO:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  ABANDONADO: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export function BookCard({ book }: { book: Book }) {
  const [currentPage, setCurrentPage] = useState(book.currentPage);
  const [isUpdating, setIsUpdating] = useState(false);

  const progress = book.pages > 0 ? (currentPage / book.pages) * 100 : 0;
  const statusText = book.status.replace("_", " ");

  const updateProgress = async (newPage: number) => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      const result = await updateReadingProgressAPI(book.id, newPage);

      if (result.success) {
        setCurrentPage(newPage);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Erro ao atualizar progresso:", error);
      // Reverter para o valor anterior em caso de erro
      setCurrentPage(book.currentPage);
      alert(
        error instanceof Error ? error.message : "Erro ao atualizar progresso"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePageChange = (delta: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const newPage = Math.max(0, Math.min(book.pages, currentPage + delta));
    if (newPage !== currentPage) {
      updateProgress(newPage);
    }
  };

  return (
    <Link href={`/biblioteca/${book.id}`} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-lg h-full flex flex-col">
        <div className="relative h-64">
          <Image
            src={
              book.cover ||
              `https://picsum.photos/300/400?random=${book.title.replace(
                /\s+/g,
                ""
              )}`
            }
            alt={`Capa do livro ${book.title}`}
            fill
            className="object-cover"
            onError={() => {
              // Handle error silently as fallback is already in src
            }}
          />
          <div
            className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full ${
              statusColors[book.status]
            }`}
          >
            {statusText}
          </div>
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <h3
            className="font-bold text-lg text-gray-800 dark:text-white truncate"
            title={book.title}
          >
            {book.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {book.author}
          </p>

          <div className="flex items-center mb-4 mt-auto">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < book.rating
                    ? "text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
                fill={i < book.rating ? "currentColor" : "none"}
              />
            ))}
          </div>

          {(book.status === "LENDO" || book.status === "PAUSADO") &&
            book.pages > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Progresso</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={(e) => handlePageChange(-5, e)}
                    disabled={isUpdating || currentPage <= 0}
                    className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Voltar 5 páginas"
                  >
                    <Minus className="h-3 w-3" />
                  </button>

                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {currentPage} / {book.pages}
                  </span>

                  <button
                    onClick={(e) => handlePageChange(5, e)}
                    disabled={isUpdating || currentPage >= book.pages}
                    className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Avançar 5 páginas"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                {isUpdating && (
                  <div className="text-center">
                    <span className="text-xs text-blue-600 dark:text-blue-400">
                      Atualizando...
                    </span>
                  </div>
                )}
              </div>
            )}

          {book.status === "LIDO" && book.pages > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Completo</span>
                <span>100%</span>
              </div>
              <div className="w-full bg-green-200 dark:bg-green-700 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: "100%" }}
                ></div>
              </div>
              <div className="text-center">
                <span className="text-xs font-medium text-green-700 dark:text-green-300">
                  {book.pages} páginas lidas
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
