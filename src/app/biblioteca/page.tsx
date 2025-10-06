"use client";

import { useEffect, useState } from "react";
import { BookCard } from "../../components/components/book-card";
import { Filters } from "../../components/components/filters";
import { SearchBar } from "../../components/components/search-bar";
import { SavedFilters } from "../../components/components/saved-filters";
import { useAdvancedSearch } from "../hooks/useAdvancedSearch";
import { Loader2, Filter } from "lucide-react";

export default function BibliotecaPage() {
  const {
    filters,
    sortBy,
    results,
    isLoading,
    stats,
    updateFilters,
    updateSort,
    clearFilters,
    savedFilters,
    saveCurrentFilter,
    applySavedFilter,
    removeSavedFilter,
    hasActiveFilters,
  } = useAdvancedSearch();

  const [availableGenres, setAvailableGenres] = useState<
    Array<{ id: string; name: string; count?: number }>
  >([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Carregar gêneros disponíveis
  useEffect(() => {
    async function loadGenres() {
      try {
        const response = await fetch("/api/categories/genres");
        const data = await response.json();
        if (data.success) {
          setAvailableGenres(data.data);
        }
      } catch (error) {
        console.error("Erro ao carregar gêneros:", error);
      }
    }
    loadGenres();
  }, []);

  // Carregar histórico de buscas
  useEffect(() => {
    const saved = localStorage.getItem("biblioteca-recent-searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error("Erro ao carregar histórico de buscas:", error);
      }
    }
  }, []);

  // Salvar busca no histórico
  const handleRecentSearch = (search: string) => {
    if (!search.trim()) return;

    const newRecentSearches = [
      search,
      ...recentSearches.filter((s) => s !== search),
    ].slice(0, 10); // Manter apenas 10 buscas recentes

    setRecentSearches(newRecentSearches);
    localStorage.setItem(
      "biblioteca-recent-searches",
      JSON.stringify(newRecentSearches)
    );
  };

  // Limpar histórico de buscas
  const handleClearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("biblioteca-recent-searches");
  };

  // Gerar sugestões de busca baseadas nos livros
  const searchSuggestions =
    results.length > 0
      ? [
          ...new Set([
            // Autores únicos
            ...results.map((book) => ({
              type: "author" as const,
              value: book.author,
              count: 1,
            })),
            // Títulos únicos
            ...results.map((book) => ({
              type: "title" as const,
              value: book.title,
              book: {
                id: book.id!,
                title: book.title,
                author: book.author,
                cover: book.cover,
              },
            })),
          ]),
        ].slice(0, 8)
      : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Minha Biblioteca
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Gerencie e explore sua coleção de livros.
        </p>
      </div>

      {/* Barra de busca e filtros */}
      <div className="space-y-4">
        {/* Busca */}
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="flex-1">
            <SearchBar
              value={filters.search}
              onChange={(value) => updateFilters({ search: value })}
              placeholder="Buscar por título, autor, ISBN..."
              suggestions={searchSuggestions}
              recentSearches={recentSearches}
              onRecentSearch={handleRecentSearch}
              onClearRecent={handleClearRecentSearches}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Filtros e controles */}
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <div className="flex items-center gap-4">
            <Filters
              filters={filters}
              sortBy={sortBy}
              onFiltersChange={updateFilters}
              onSortChange={updateSort}
              onClearFilters={clearFilters}
              availableGenres={availableGenres}
              stats={stats}
              isLoading={isLoading}
            />

            <SavedFilters
              savedFilters={savedFilters}
              onApplyFilter={applySavedFilter}
              onSaveCurrentFilter={saveCurrentFilter}
              onRemoveFilter={removeSavedFilter}
              hasActiveFilters={hasActiveFilters}
            />
          </div>

          {/* Indicador de filtros ativos */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm text-red-600 
                       hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              <Filter className="w-4 h-4" />
              <span>Limpar todos os filtros</span>
            </button>
          )}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            Carregando livros...
          </span>
        </div>
      )}

      {/* Estatísticas dos resultados */}
      {!isLoading && stats && (
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div>
            Mostrando <span className="font-medium">{stats.showing}</span> de{" "}
            <span className="font-medium">{stats.total}</span> livro
            {stats.total !== 1 ? "s" : ""}
            {hasActiveFilters && (
              <span className="ml-2 text-blue-600 dark:text-blue-400">
                (filtrado)
              </span>
            )}
          </div>

          {stats.total > 0 && (
            <div className="text-right">
              <div>Média: {stats.averageRating.toFixed(1)}⭐</div>
            </div>
          )}
        </div>
      )}

      {/* Grid de livros */}
      {!isLoading && (
        <>
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {results.map((book) => (
                <BookCard key={book.id || ""} book={book as any} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              {hasActiveFilters ? (
                <div>
                  <Filter className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                    Nenhum livro encontrado com os filtros aplicados
                  </p>
                  <button
                    onClick={clearFilters}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Limpar filtros e ver todos os livros
                  </button>
                </div>
              ) : (
                <div>
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    📚
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                    Sua biblioteca está vazia
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 mb-4">
                    Comece adicionando seu primeiro livro!
                  </p>
                  <a
                    href="/adicionar"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Adicionar Livro
                  </a>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
