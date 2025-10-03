"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  Filter,
  RotateCcw,
  Star,
  Calendar,
  BookOpen,
  Bookmark,
  User,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { SearchFilters, SortOption } from "../../app/hooks/useAdvancedSearch";
import { BookStatus } from "../../app/types/book";

interface FiltersProps {
  filters: SearchFilters;
  sortBy: SortOption;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
  onSortChange: (sort: Partial<SortOption>) => void;
  onClearFilters: () => void;
  availableGenres?: Array<{ id: string; name: string; count?: number }>;
  stats?: {
    total: number;
    showing: number;
    hasFiltersApplied: boolean;
  };
  isLoading?: boolean;
}

const STATUS_OPTIONS: { value: BookStatus; label: string; color: string }[] = [
  {
    value: "QUERO_LER",
    label: "Quero Ler",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  {
    value: "LENDO",
    label: "Lendo",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  {
    value: "LIDO",
    label: "Lido",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  },
  {
    value: "PAUSADO",
    label: "Pausado",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
  {
    value: "ABANDONADO",
    label: "Abandonado",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
];

const SORT_OPTIONS: {
  field: SortOption["field"];
  label: string;
  icon: React.ReactNode;
}[] = [
  { field: "title", label: "Título", icon: <BookOpen className="w-4 h-4" /> },
  { field: "author", label: "Autor", icon: <User className="w-4 h-4" /> },
  { field: "rating", label: "Avaliação", icon: <Star className="w-4 h-4" /> },
  { field: "year", label: "Ano", icon: <Calendar className="w-4 h-4" /> },
  { field: "pages", label: "Páginas", icon: <BookOpen className="w-4 h-4" /> },
  {
    field: "createdAt",
    label: "Adicionado em",
    icon: <Bookmark className="w-4 h-4" />,
  },
  {
    field: "updatedAt",
    label: "Atualizado em",
    icon: <Bookmark className="w-4 h-4" />,
  },
];

export function Filters({
  filters,
  sortBy,
  onFiltersChange,
  onSortChange,
  onClearFilters,
  availableGenres = [],
  stats,
  isLoading = false,
}: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"filters" | "sort">("filters");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Contar filtros ativos
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "search") return false; // Search não conta como filtro visual
    if (typeof value === "string") return value !== "";
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "object" && value !== null) {
      if (key === "rating") return value.min > 0 || value.max < 5;
      if (key === "year")
        return value.min > 1900 || value.max < new Date().getFullYear();
      if (key === "pages") return value.min > 0 || value.max < 2000;
    }
    return false;
  }).length;

  const hasActiveFilters = activeFiltersCount > 0 || stats?.hasFiltersApplied;

  // Handlers para filtros individuais
  const handleStatusChange = (status: BookStatus, checked: boolean) => {
    const currentStatus = Array.isArray(filters.status)
      ? filters.status
      : filters.status
      ? [filters.status]
      : [];
    const newStatus = checked
      ? [...currentStatus, status]
      : currentStatus.filter((s) => s !== status);
    onFiltersChange({ status: newStatus });
  };

  const handleRatingChange = (min: number, max: number) => {
    onFiltersChange({ rating: { min, max } });
  };

  const handleYearChange = (min: number, max: number) => {
    onFiltersChange({ year: { min, max } });
  };

  const handlePagesChange = (min: number, max: number) => {
    onFiltersChange({ pages: { min, max } });
  };

  const currentStatus = Array.isArray(filters.status)
    ? filters.status
    : filters.status
    ? [filters.status]
    : [];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botão principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-4 py-2 border rounded-lg text-sm font-medium
                   hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                   ${
                     hasActiveFilters
                       ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                       : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                   }`}
      >
        <Filter className="w-4 h-4" />
        <span>Filtros</span>
        {hasActiveFilters && (
          <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
            {activeFiltersCount}
          </span>
        )}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Indicador de resultados */}
      {stats && (
        <div className="absolute -bottom-6 left-0 text-xs text-gray-500 dark:text-gray-400">
          {isLoading ? (
            <span>Carregando...</span>
          ) : (
            <span>
              {stats.showing} de {stats.total} livro
              {stats.total !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute top-full mt-2 w-96 bg-white dark:bg-gray-800 border border-gray-200 
                      dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden"
        >
          {/* Header com abas */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("filters")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors
                         ${
                           activeTab === "filters"
                             ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                             : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                         }`}
            >
              <Filter className="w-4 h-4 inline mr-2" />
              Filtros
            </button>
            <button
              onClick={() => setActiveTab("sort")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors
                         ${
                           activeTab === "sort"
                             ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                             : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                         }`}
            >
              {sortBy.direction === "asc" ? (
                <SortAsc className="w-4 h-4 inline mr-2" />
              ) : (
                <SortDesc className="w-4 h-4 inline mr-2" />
              )}
              Ordenação
            </button>
          </div>

          <div className="p-4 space-y-6 max-h-80 overflow-y-auto">
            {activeTab === "filters" ? (
              <>
                {/* Gênero */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gênero
                  </label>
                  <select
                    value={filters.genre}
                    onChange={(e) => onFiltersChange({ genre: e.target.value })}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                  >
                    <option value="">Todos os gêneros</option>
                    {availableGenres.map((genre) => (
                      <option key={genre.id} value={genre.name}>
                        {genre.name} {genre.count && `(${genre.count})`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <div className="space-y-2">
                    {STATUS_OPTIONS.map((status) => (
                      <label
                        key={status.value}
                        className="flex items-center space-x-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={currentStatus.includes(status.value)}
                          onChange={(e) =>
                            handleStatusChange(status.value, e.target.checked)
                          }
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Autor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Autor
                  </label>
                  <input
                    type="text"
                    value={filters.author}
                    onChange={(e) =>
                      onFiltersChange({ author: e.target.value })
                    }
                    placeholder="Nome do autor"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                  />
                </div>

                {/* Avaliação */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Avaliação
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">
                        Mínima
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="1"
                        value={filters.rating.min}
                        onChange={(e) =>
                          handleRatingChange(
                            parseInt(e.target.value),
                            filters.rating.max
                          )
                        }
                        className="w-full"
                      />
                      <div className="flex items-center justify-center mt-1">
                        <span className="text-sm">{filters.rating.min}</span>
                        <Star className="w-4 h-4 text-yellow-400 ml-1" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">
                        Máxima
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="1"
                        value={filters.rating.max}
                        onChange={(e) =>
                          handleRatingChange(
                            filters.rating.min,
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full"
                      />
                      <div className="flex items-center justify-center mt-1">
                        <span className="text-sm">{filters.rating.max}</span>
                        <Star className="w-4 h-4 text-yellow-400 ml-1" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ano de publicação */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ano de Publicação
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">
                        De
                      </label>
                      <input
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={filters.year.min}
                        onChange={(e) =>
                          handleYearChange(
                            parseInt(e.target.value),
                            filters.year.max
                          )
                        }
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">
                        Até
                      </label>
                      <input
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={filters.year.max}
                        onChange={(e) =>
                          handleYearChange(
                            filters.year.min,
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Número de páginas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Número de Páginas
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">
                        Mínimo
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="2000"
                        value={filters.pages.min}
                        onChange={(e) =>
                          handlePagesChange(
                            parseInt(e.target.value),
                            filters.pages.max
                          )
                        }
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">
                        Máximo
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="2000"
                        value={filters.pages.max}
                        onChange={(e) =>
                          handlePagesChange(
                            filters.pages.min,
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Aba de Ordenação */
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ordenar por
                  </label>
                  <div className="space-y-2">
                    {SORT_OPTIONS.map((option) => (
                      <label
                        key={option.field}
                        className="flex items-center space-x-3 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="sortField"
                          checked={sortBy.field === option.field}
                          onChange={() => onSortChange({ field: option.field })}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <div className="flex items-center space-x-2">
                          {option.icon}
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {option.label}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Direção
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="sortDirection"
                        checked={sortBy.direction === "asc"}
                        onChange={() => onSortChange({ direction: "asc" })}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div className="flex items-center space-x-2">
                        <SortAsc className="w-4 h-4" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Crescente
                        </span>
                      </div>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="sortDirection"
                        checked={sortBy.direction === "desc"}
                        onChange={() => onSortChange({ direction: "desc" })}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div className="flex items-center space-x-2">
                        <SortDesc className="w-4 h-4" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Decrescente
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClearFilters}
              disabled={!hasActiveFilters}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 
                       hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Limpar filtros</span>
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
