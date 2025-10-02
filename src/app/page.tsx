<<<<<<< HEAD
import { StatsCard } from "./components/stats-card";
import books from "./data/books";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DeleteBookButton from "./components/delete-book-button";

type Book = {
  status: string;
  currentPage?: number;
  pages?: number;
};
=======
import { Book, Library, CheckCircle } from "lucide-react";
import { StatsCard } from "@/components/components/stats-card";
>>>>>>> main

export default function DashboardPage() {
  // Dados de exemplo - serão substituídos por chamadas ao Prisma
  const stats = [
    {
      icon: Library,
      label: "Total de Livros",
      value: 25,
      color: "bg-blue-500",
    },
    {
      icon: Book,
      label: "Livros Sendo Lidos",
      value: 3,
      color: "bg-yellow-500",
    },
    {
      icon: CheckCircle,
      label: "Livros Concluídos",
      value: 15,
      color: "bg-green-500",
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <StatsCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            color={stat.color}
          />
        ))}
      </div>

      {/* Outras seções do dashboard podem ser adicionadas aqui */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Atividade Recente</h2>
        <p className="text-gray-600 dark:text-gray-400">Em breve: Uma lista dos últimos livros adicionados ou atualizados.</p>
      </div>
    </div>
  );
}

