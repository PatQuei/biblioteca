"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Tag } from "lucide-react";
import { createGenre, deleteGenre } from "../../app/actions/books";
import type { Genre } from "../../app/types/book";

interface GenreManagerProps {
  onGenreCreated?: (genre: Genre) => void;
  onGenreDeleted?: (genreId: string) => void;
  compact?: boolean;
}

export function GenreManager({
  onGenreCreated,
  onGenreDeleted,
  compact = false,
}: GenreManagerProps) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [newGenreName, setNewGenreName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar gêneros
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        if (data.success) {
          setGenres(data.data);
          
          // Mostrar mensagem se for dados de demonstração
          if (data.demo) {
            setError(data.message || "Modo demonstração ativo");
          }
        } else {
          setError("Erro ao carregar gêneros");
        }
      } catch (error) {
        console.error("Erro ao carregar gêneros:", error);
        setError("Erro ao carregar gêneros");
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const handleCreateGenre = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newGenreName.trim()) {
      alert("Por favor, digite o nome do gênero");
      return;
    }

    setIsCreating(true);
    try {
      const formData = new FormData();
      formData.append("name", newGenreName.trim());

      const result = await createGenre(formData);

      if (result.success && result.data) {
        const newGenre = result.data;
        setGenres((prev) => [...prev, newGenre]);
        setNewGenreName("");
        onGenreCreated?.(newGenre);
        
        // Mostrar mensagem apropriada baseada no tipo de resposta
        if ((result as any).demo || (result as any).fallback) {
          alert((result as any).message || "Gênero criado em modo demonstração");
        } else {
          alert(result.message || "Gênero criado com sucesso");
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Erro ao criar gênero:", error);
      alert(error instanceof Error ? error.message : "Erro ao criar gênero");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteGenre = async (genreId: string, genreName: string) => {
    if (!confirm(`Tem certeza que deseja deletar o gênero "${genreName}"?`)) {
      return;
    }

    setIsDeleting(genreId);
    try {
      const result = await deleteGenre(genreId);

      if (result.success) {
        setGenres((prev) => prev.filter((g) => g.id !== genreId));
        onGenreDeleted?.(genreId);
        alert(result.message);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Erro ao deletar gênero:", error);
      alert(error instanceof Error ? error.message : "Erro ao deletar gênero");
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Carregando gêneros...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Gêneros Disponíveis
        </h3>

        <div className="flex flex-wrap gap-2 mb-4">
          {genres.map((genre) => (
            <span
              key={genre.id}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
            >
              {genre.name}
              <button
                onClick={() => handleDeleteGenre(genre.id, genre.name)}
                disabled={isDeleting === genre.id}
                className="ml-1 text-red-600 hover:text-red-800 disabled:opacity-50"
                title={`Deletar ${genre.name}`}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>

        <form onSubmit={handleCreateGenre} className="flex gap-2">
          <input
            type="text"
            value={newGenreName}
            onChange={(e) => setNewGenreName(e.target.value)}
            placeholder="Novo gênero..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={isCreating}
          />
          <button
            type="submit"
            disabled={isCreating || !newGenreName.trim()}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded transition-colors disabled:cursor-not-allowed"
          >
            {isCreating ? "Criando..." : <Plus className="h-4 w-4" />}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Tag className="h-6 w-6" />
          Gerenciar Gêneros
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {genres.length} gênero(s) cadastrado(s)
        </span>
      </div>

      {/* Formulário para adicionar novo gênero */}
      <form onSubmit={handleCreateGenre} className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1">
            <label
              htmlFor="genreName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Nome do Gênero
            </label>
            <input
              type="text"
              id="genreName"
              value={newGenreName}
              onChange={(e) => setNewGenreName(e.target.value)}
              placeholder="Digite o nome do gênero..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={isCreating}
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={isCreating || !newGenreName.trim()}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {isCreating ? "Criando..." : "Adicionar"}
            </button>
          </div>
        </div>
      </form>

      {/* Lista de gêneros */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Gêneros Existentes
        </h3>

        {genres.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Tag className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Nenhum gênero cadastrado ainda.</p>
            <p className="text-sm">
              Adicione o primeiro gênero usando o formulário acima.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {genres.map((genre) => (
              <div
                key={genre.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {genre.name}
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteGenre(genre.id, genre.name)}
                  disabled={isDeleting === genre.id}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed p-1 rounded transition-colors"
                  title={`Deletar ${genre.name}`}
                >
                  {isDeleting === genre.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
