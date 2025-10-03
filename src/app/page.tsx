"use client";

import React, { useState, useEffect } from "react";
import {
  Book,
  Library,
  CheckCircle,
  Heart,
  Clock,
  Star,
  Target,
  TrendingUp,
} from "lucide-react";
import { StatsCard } from "../components/components/stats-card";
import { ProgressBar } from "../components/components/progress-bar";
import { RecentActivity } from "../components/components/recent-activity";
import { TopGenres } from "../components/components/top-genres";
import { DailyProgressWidget } from "../components/components/daily-progress-widget";
import type { DashboardStats } from "./types/stats";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats");
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.error || "Erro ao carregar estatísticas");
      }
    } catch (err) {
      console.error("Erro ao buscar estatísticas:", err);
      setError("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-pulse"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-gray-300 dark:bg-gray-600">
                  <div className="h-6 w-6 bg-gray-400 dark:bg-gray-500 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Dashboard
        </h1>
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const mainStats = [
    {
      icon: Library,
      label: "Total de Livros",
      value: stats.overview.totalBooks,
      color: "bg-blue-500",
    },
    {
      icon: Book,
      label: "Lendo Atualmente",
      value: stats.overview.readingBooks,
      color: "bg-yellow-500",
    },
    {
      icon: CheckCircle,
      label: "Livros Concluídos",
      value: stats.overview.finishedBooks,
      color: "bg-green-500",
    },
    {
      icon: Heart,
      label: "Para Ler",
      value: stats.overview.wantToReadBooks,
      color: "bg-purple-500",
    },
  ];

  const additionalStats = [
    {
      icon: Clock,
      label: "Livros Pausados",
      value: stats.overview.pausedBooks,
      color: "bg-orange-500",
    },
    {
      icon: Star,
      label: "Avaliação Média",
      value: stats.overview.averageRating
        ? `${stats.overview.averageRating}/5`
        : "N/A",
      color: "bg-indigo-500",
    },
    {
      icon: Target,
      label: "Gêneros Explorados",
      value: stats.overview.totalGenres,
      color: "bg-pink-500",
    },
    {
      icon: TrendingUp,
      label: "Progresso Total",
      value: `${stats.progress.readingProgress}%`,
      color: "bg-teal-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Acompanhe seu progresso de leitura e estatísticas
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Páginas lidas
            </p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.progress.readPages.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat) => (
          <StatsCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            color={stat.color}
          />
        ))}
      </div>

      {/* Progresso de leitura */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Progresso de Leitura
        </h2>
        <div className="space-y-4">
          <ProgressBar
            current={stats.progress.readPages}
            total={stats.progress.totalPages}
            label="Páginas Lidas"
            color="bg-green-500"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.progress.readPages.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Páginas Lidas
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.progress.totalPages.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total de Páginas
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.overview.finishedBooks}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Livros Finalizados
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.overview.readingBooks}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Em Progresso
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {additionalStats.map((stat) => (
          <StatsCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            color={stat.color}
          />
        ))}
      </div>

      {/* Seção inferior com widget de progresso diário e atividades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DailyProgressWidget onProgressUpdate={() => fetchStats()} />
        <RecentActivity activities={stats.recentActivity} />
        <TopGenres genres={stats.topGenres} />
      </div>

      {/* Livros mais bem avaliados */}
      {stats.topRatedBooks.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 mb-4">
            <Star className="h-5 w-5 text-yellow-500" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Livros Mais Bem Avaliados
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.topRatedBooks.slice(0, 3).map((book) => (
              <div
                key={book.id}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-800 dark:text-white text-sm truncate flex-1">
                    {book.title}
                  </h3>
                  <div className="flex items-center space-x-1 ml-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                      {book.rating}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {book.author}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                  {book.genre}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
