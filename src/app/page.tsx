import { StatsCard } from "../components/stats-card";
import books from "./data/books";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Book = {
  status: string;
  currentPage?: number;
  pages?: number;
};

export default function DashboardPage() {
  const totalLivros = books.length;
  const lidos = books.filter((b: Book) => b.status === "LIDO").length;
  const lendo = books.filter((b: Book) => b.status === "LENDO").length;
  const paginasLidas = books
    .filter((b: Book) => b.status === "LIDO" || b.status === "LENDO")
    .reduce((acc: number, b: Book) => acc + (b.currentPage ?? b.pages ?? 0), 0);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">📚 Dashboard</h1>

      {/* Estatísticas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard title="Total de Livros" value={totalLivros} />
        <StatsCard title="Livros Lidos" value={lidos} />
        <StatsCard title="Lendo Agora" value={lendo} />
        <StatsCard title="Páginas Lidas" value={paginasLidas} />
      </div>

      {/* Links Rápidos */}
      <div className="flex gap-4">
        <Link href="/biblioteca">
          <Button>Ir para Biblioteca</Button>
        </Link>
        <Link href="/adicionar">
          <Button variant="outline">Adicionar Novo Livro</Button>
        </Link>
      </div>
    </div>
  );
}
