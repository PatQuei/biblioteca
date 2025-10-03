"use client";

import { useState } from "react";
import { Bookmark, Plus, Trash2, Calendar } from "lucide-react";
import { SavedFilter } from "../../app/hooks/useAdvancedSearch";

interface SavedFiltersProps {
  savedFilters: SavedFilter[];
  onApplyFilter: (filter: SavedFilter) => void;
  onSaveCurrentFilter: (name: string) => void;
  onRemoveFilter: (filterId: string) => void;
  hasActiveFilters: boolean;
}

export function SavedFilters({
  savedFilters,
  onApplyFilter,
  onSaveCurrentFilter,
  onRemoveFilter,
  hasActiveFilters,
}: SavedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState("");

  const handleSaveFilter = () => {
    if (filterName.trim()) {
      onSaveCurrentFilter(filterName.trim());
      setFilterName("");
      setShowSaveDialog(false);
    }
  };

  const formatFilterDescription = (filter: SavedFilter) => {
    const parts: string[] = [];

    if (filter.filters.search) {
      parts.push(`Busca: "${filter.filters.search}"`);
    }

    if (filter.filters.genre) {
      parts.push(`Gênero: ${filter.filters.genre}`);
    }

    if (filter.filters.status) {
      const status = Array.isArray(filter.filters.status)
        ? filter.filters.status.join(", ")
        : filter.filters.status;
      parts.push(`Status: ${status}`);
    }

    if (filter.filters.author) {
      parts.push(`Autor: ${filter.filters.author}`);
    }

    if (
      filter.filters.rating &&
      (filter.filters.rating.min > 0 || filter.filters.rating.max < 5)
    ) {
      parts.push(
        `Avaliação: ${filter.filters.rating.min}-${filter.filters.rating.max}⭐`
      );
    }

    if (filter.sortBy) {
      const direction = filter.sortBy.direction === "asc" ? "↑" : "↓";
      parts.push(`Ordenação: ${filter.sortBy.field} ${direction}`);
    }

    return parts.length > 0 ? parts.join(" • ") : "Filtro personalizado";
  };

  return (
    <div className="relative">
      {/* Botão principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 border rounded-lg text-sm
                   hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                   ${
                     savedFilters.length > 0
                       ? "border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                       : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                   }`}
      >
        <Bookmark className="w-4 h-4" />
        <span>Salvos</span>
        {savedFilters.length > 0 && (
          <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
            {savedFilters.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute top-full mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 
                      dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              Filtros Salvos
            </h3>
            {hasActiveFilters && (
              <button
                onClick={() => setShowSaveDialog(true)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-purple-600 text-white text-sm 
                         rounded-md hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Salvar</span>
              </button>
            )}
          </div>

          {/* Conteúdo */}
          <div className="max-h-64 overflow-y-auto">
            {savedFilters.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhum filtro salvo</p>
                <p className="text-xs mt-1">
                  Configure filtros e clique em &ldquo;Salvar&rdquo; para criar
                  presets rápidos
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {savedFilters.map((filter) => (
                  <div
                    key={filter.id}
                    className="group flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 
                             dark:hover:bg-gray-700 transition-colors"
                  >
                    <button
                      onClick={() => {
                        onApplyFilter(filter);
                        setIsOpen(false);
                      }}
                      className="flex-1 text-left"
                    >
                      <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        {filter.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {formatFilterDescription(filter)}
                      </div>
                      <div className="flex items-center text-xs text-gray-400 mt-2">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(filter.createdAt).toLocaleDateString()}
                      </div>
                    </button>

                    <button
                      onClick={() => onRemoveFilter(filter.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 
                               transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dialog para salvar filtro */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-[90vw]">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Salvar Filtro Atual
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome do filtro
              </label>
              <input
                type="text"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="Ex: Ficção científica em português"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm
                         focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSaveFilter();
                  } else if (e.key === "Escape") {
                    setShowSaveDialog(false);
                    setFilterName("");
                  }
                }}
              />
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setFilterName("");
                }}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 
                         dark:hover:text-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveFilter}
                disabled={!filterName.trim()}
                className="px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 
                         transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
