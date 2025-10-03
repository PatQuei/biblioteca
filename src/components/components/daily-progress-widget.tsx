"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Target, TrendingUp, Calendar } from "lucide-react";

interface DailyProgressData {
  readingBooks: Array<{
    id: string;
    title: string;
    author: string;
    currentPage: number;
    totalPages: number;
    progress: number;
  }>;
  todayGoal: number;
  pagesReadToday: number;
  weeklyGoal: number;
  pagesReadThisWeek: number;
  streak: number;
}

interface DailyProgressWidgetProps {
  onProgressUpdate?: () => void;
}

export function DailyProgressWidget({
  onProgressUpdate,
}: DailyProgressWidgetProps) {
  const [data, setData] = useState<DailyProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyProgress();
  }, []);

  const fetchDailyProgress = async () => {
    try {
      const response = await fetch("/api/daily-progress");
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Erro ao buscar progresso diário:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookProgress = async (bookId: string, newPage: number) => {
    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPage: newPage,
        }),
      });

      if (response.ok) {
        await fetchDailyProgress();
        onProgressUpdate?.();
      }
    } catch (error) {
      console.error("Erro ao atualizar progresso:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-48"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex items-center space-x-2 mb-4">
          <BookOpen className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Progresso Diário
          </h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Erro ao carregar dados de progresso.
        </p>
      </div>
    );
  }

  const dailyProgress =
    data.todayGoal > 0 ? (data.pagesReadToday / data.todayGoal) * 100 : 0;
  const weeklyProgress =
    data.weeklyGoal > 0 ? (data.pagesReadThisWeek / data.weeklyGoal) * 100 : 0;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Progresso Diário
          </h2>
        </div>
        <div className="flex items-center space-x-1 text-sm text-orange-600 dark:text-orange-400">
          <Calendar className="h-4 w-4" />
          <span>{data.streak} dias seguidos</span>
        </div>
      </div>

      {/* Metas diárias e semanais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Target className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Meta Diária
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {data.pagesReadToday}/{data.todayGoal} páginas
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(dailyProgress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {Math.round(dailyProgress)}% concluído
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Meta Semanal
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {data.pagesReadThisWeek}/{data.weeklyGoal} páginas
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(weeklyProgress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {Math.round(weeklyProgress)}% concluído
          </p>
        </div>
      </div>

      {/* Livros em progresso */}
      {data.readingBooks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Livros em Progresso
          </h3>
          <div className="space-y-3">
            {data.readingBooks.slice(0, 3).map((book) => (
              <div
                key={book.id}
                className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-800 dark:text-white truncate">
                      {book.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {book.author}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    {Math.round(book.progress)}%
                  </span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mb-2">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${book.progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {book.currentPage} / {book.totalPages} páginas
                  </span>

                  <div className="flex space-x-1">
                    <button
                      onClick={() =>
                        updateBookProgress(
                          book.id,
                          Math.max(0, book.currentPage - 1)
                        )
                      }
                      className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded transition-colors"
                      disabled={book.currentPage <= 0}
                    >
                      -1
                    </button>
                    <button
                      onClick={() =>
                        updateBookProgress(
                          book.id,
                          Math.min(book.totalPages, book.currentPage + 1)
                        )
                      }
                      className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 rounded transition-colors"
                      disabled={book.currentPage >= book.totalPages}
                    >
                      +1
                    </button>
                    <button
                      onClick={() =>
                        updateBookProgress(
                          book.id,
                          Math.min(book.totalPages, book.currentPage + 5)
                        )
                      }
                      className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800 rounded transition-colors"
                      disabled={book.currentPage >= book.totalPages}
                    >
                      +5
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {data.readingBooks.length > 3 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
              E mais {data.readingBooks.length - 3} livro(s)...
            </p>
          )}
        </div>
      )}

      {data.readingBooks.length === 0 && (
        <div className="text-center py-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Nenhum livro em progresso no momento.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Comece a ler um livro para acompanhar seu progresso aqui!
          </p>
        </div>
      )}
    </div>
  );
}
