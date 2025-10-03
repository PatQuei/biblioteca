import React from "react";
import { BarChart3, Trophy } from "lucide-react";
import type { DashboardStats } from "../../app/types/stats";

interface TopGenresProps {
  genres: DashboardStats["topGenres"];
}

export function TopGenres({ genres }: TopGenresProps) {
  if (genres.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="h-5 w-5 text-gray-500" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Gêneros Mais Lidos
          </h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          Nenhum gênero encontrado.
        </p>
      </div>
    );
  }

  const maxCount = Math.max(...genres.map((g) => g.count));

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-2 mb-4">
        <BarChart3 className="h-5 w-5 text-gray-500" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Gêneros Mais Lidos
        </h2>
      </div>

      <div className="space-y-4">
        {genres.map((genre, index) => {
          const percentage = maxCount > 0 ? (genre.count / maxCount) * 100 : 0;
          const isTop = index === 0;

          return (
            <div key={genre.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {isTop && <Trophy className="h-4 w-4 text-yellow-500" />}
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {genre.name}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  {genre.count} {genre.count === 1 ? "livro" : "livros"}
                </span>
              </div>

              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    isTop
                      ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                      : index === 1
                      ? "bg-gradient-to-r from-blue-400 to-blue-600"
                      : index === 2
                      ? "bg-gradient-to-r from-green-400 to-green-600"
                      : "bg-gradient-to-r from-purple-400 to-purple-600"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {genres.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 py-4">
          <p>Adicione alguns livros para ver suas preferências de gênero!</p>
        </div>
      )}
    </div>
  );
}
