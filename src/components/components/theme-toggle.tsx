"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-900 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
      aria-label={`Alterar para modo ${theme === "light" ? "escuro" : "claro"}`}
    >
      <Sun
        className={`h-5 w-5 transition-all ${
          theme === "light" ? "rotate-0 scale-100" : "-rotate-90 scale-0"
        }`}
      />
      <Moon
        className={`absolute h-5 w-5 transition-all ${
          theme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"
        }`}
      />
    </button>
  );
}
