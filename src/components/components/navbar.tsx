import Link from "next/link";
import { BookMarked, LayoutDashboard, Plus, Tag } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export const Navbar = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <BookMarked className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <span className="text-2xl font-bold text-gray-800 dark:text-white">
            Biblioteca DOMinadores
          </span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex items-center text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
          >
            <LayoutDashboard className="h-5 w-5 mr-2" />
            Dashboard
          </Link>
          <Link
            href="/biblioteca"
            className="flex items-center text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
          >
            <BookMarked className="h-5 w-5 mr-2" />
            Biblioteca
          </Link>
          <Link
            href="/adicionar"
            className="flex items-center text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Adicionar
          </Link>
          <Link
            href="/generos"
            className="flex items-center text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
          >
            <Tag className="h-5 w-5 mr-2" />
            Gêneros
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};
