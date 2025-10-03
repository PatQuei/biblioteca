import React from "react";
import Link from "next/link";
import { Clock, BookOpen, CheckCircle, Pause, X, Heart } from "lucide-react";
import type { DashboardStats } from "../../app/types/stats";

interface RecentActivityProps {
  activities: DashboardStats["recentActivity"];
}

function getStatusIcon(status: string) {
  switch (status) {
    case "LENDO":
      return <BookOpen className="h-4 w-4 text-yellow-500" />;
    case "LIDO":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "PAUSADO":
      return <Pause className="h-4 w-4 text-blue-500" />;
    case "ABANDONADO":
      return <X className="h-4 w-4 text-red-500" />;
    case "QUERO_LER":
      return <Heart className="h-4 w-4 text-purple-500" />;
    default:
      return <BookOpen className="h-4 w-4 text-gray-500" />;
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "LENDO":
      return "Lendo";
    case "LIDO":
      return "Lido";
    case "PAUSADO":
      return "Pausado";
    case "ABANDONADO":
      return "Abandonado";
    case "QUERO_LER":
      return "Quero Ler";
    default:
      return status;
  }
}

function formatDate(date: Date) {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "Hoje";
  if (diffDays === 2) return "Ontem";
  if (diffDays <= 7) return `${diffDays - 1} dias atrás`;
  if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} semanas atrás`;

  return new Date(date).toLocaleDateString("pt-BR");
}

export function RecentActivity({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="h-5 w-5 text-gray-500" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Atividade Recente
          </h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          Nenhuma atividade recente encontrada.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-2 mb-4">
        <Clock className="h-5 w-5 text-gray-500" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Atividade Recente
        </h2>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {getStatusIcon(activity.status)}

              <div className="flex-1 min-w-0">
                <Link
                  href={`/livros/${activity.id}`}
                  className="block hover:underline"
                >
                  <p className="font-medium text-gray-800 dark:text-white truncate">
                    {activity.title}
                  </p>
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {activity.author} • {activity.genre}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-right">
              <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                {getStatusLabel(activity.status)}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {formatDate(activity.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <Link
          href="/biblioteca"
          className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Ver todos os livros
        </Link>
      </div>
    </div>
  );
}
