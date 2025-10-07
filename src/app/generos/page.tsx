"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GenreManager } from "../../components/components/genre-manager";

export default function GenerosPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/biblioteca"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar à Biblioteca
        </Link>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Gerenciar Gêneros
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Adicione, visualize e remova gêneros para organizar sua biblioteca
          </p>
        </div>
      </div>

      {/* Componente de gerenciamento */}
      <GenreManager />

      {/* Informações adicionais */}
      <div className="mt-8 space-y-4">
        {/* Aviso sobre ambiente de demonstração */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300 mb-2">
            🌟 Modo Demonstração
          </h3>
          <p className="text-sm text-amber-700 dark:text-amber-400">
            Esta aplicação está rodando em modo demonstração. As modificações nos gêneros são simuladas e não serão salvas permanentemente.
            Para usar o sistema completo com dados reais, execute a aplicação localmente.
          </p>
        </div>

        {/* Dicas de uso */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">
            💡 Dicas importantes:
          </h3>
          <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
            <li>
              • Gêneros que já possuem livros associados não podem ser deletados
            </li>
            <li>
              • Os gêneros criados aqui estarão disponíveis ao adicionar novos
              livros
            </li>
            <li>• Mantenha os nomes dos gêneros claros e organizados</li>
            <li>
              • Exemplos: Romance, Ficção Científica, Biografia, Técnico, etc.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
