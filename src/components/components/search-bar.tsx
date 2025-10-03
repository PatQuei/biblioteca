"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Clock, BookOpen, User } from "lucide-react";

export interface SearchSuggestion {
  type: "title" | "author" | "recent" | "popular";
  value: string;
  count?: number;
  book?: {
    id: string;
    title: string;
    author: string;
    cover: string;
  };
}

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  recentSearches?: string[];
  onRecentSearch?: (search: string) => void;
  onClearRecent?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Buscar por título, autor, ISBN...",
  suggestions = [],
  recentSearches = [],
  onRecentSearch,
  onClearRecent,
  isLoading = false,
  className = "",
}: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navegação por teclado
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isOpen) return;

      const totalItems =
        (recentSearches.length > 0 ? recentSearches.length + 1 : 0) +
        suggestions.length;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setHighlightedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
          break;
        case "ArrowUp":
          event.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
          break;
        case "Enter":
          event.preventDefault();
          if (highlightedIndex >= 0) {
            // Inline implementation to avoid dependency issues
            let selectedValue = "";

            if (recentSearches.length > 0) {
              if (highlightedIndex === 0) {
                return;
              } else if (highlightedIndex <= recentSearches.length) {
                selectedValue = recentSearches[highlightedIndex - 1];
              } else {
                selectedValue =
                  suggestions[highlightedIndex - recentSearches.length - 1]
                    ?.value || "";
              }
            } else {
              selectedValue = suggestions[highlightedIndex]?.value || "";
            }

            if (selectedValue) {
              onChange(selectedValue);
              onRecentSearch?.(selectedValue);
              setIsOpen(false);
              setHighlightedIndex(-1);
            }
          }
          break;
        case "Escape":
          setIsOpen(false);
          setHighlightedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [
    isOpen,
    highlightedIndex,
    suggestions,
    recentSearches,
    onChange,
    onRecentSearch,
  ]);

  const handleInputChange = (newValue: string) => {
    onChange(newValue);
    setIsOpen(newValue.length > 0 || recentSearches.length > 0);
    setHighlightedIndex(-1);
  };

  const handleInputFocus = () => {
    setIsOpen(value.length > 0 || recentSearches.length > 0);
  };

  const handleSelectSuggestion = (index: number) => {
    let selectedValue = "";

    // Determinar qual item foi selecionado
    if (recentSearches.length > 0) {
      if (index === 0) {
        // Header "Busca recente" - não fazer nada
        return;
      } else if (index <= recentSearches.length) {
        selectedValue = recentSearches[index - 1];
      } else {
        selectedValue =
          suggestions[index - recentSearches.length - 1]?.value || "";
      }
    } else {
      selectedValue = suggestions[index]?.value || "";
    }

    if (selectedValue) {
      onChange(selectedValue);
      onRecentSearch?.(selectedValue);
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const handleClearInput = () => {
    onChange("");
    setIsOpen(recentSearches.length > 0);
    inputRef.current?.focus();
  };

  const filteredSuggestions = suggestions.filter(
    (s) =>
      s.value.toLowerCase().includes(value.toLowerCase()) && s.value !== value
  );

  const showSuggestions =
    isOpen &&
    ((value.length > 0 && filteredSuggestions.length > 0) ||
      recentSearches.length > 0);

  const getIconForSuggestion = (type: SearchSuggestion["type"]) => {
    switch (type) {
      case "author":
        return <User className="w-4 h-4" />;
      case "title":
        return <BookOpen className="w-4 h-4" />;
      case "recent":
        return <Clock className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const getSuggestionLabel = (suggestion: SearchSuggestion) => {
    switch (suggestion.type) {
      case "author":
        return `Autor: ${suggestion.value}`;
      case "title":
        return `Livro: ${suggestion.value}`;
      case "popular":
        return `${suggestion.value} (${suggestion.count} resultados)`;
      default:
        return suggestion.value;
    }
  };

  let currentIndex = 0;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full" />
          ) : (
            <Search className="w-5 h-5 text-gray-400" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg 
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                   dark:bg-gray-800 dark:border-gray-600 dark:text-white
                   dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />

        {value && (
          <button
            onClick={handleClearInput}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        )}
      </div>

      {showSuggestions && (
        <div
          className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 
                      dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto"
        >
          {/* Buscas recentes */}
          {recentSearches.length > 0 && (
            <div>
              <div
                className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 
                            border-b border-gray-200 dark:border-gray-700 flex items-center justify-between"
              >
                <span>Buscas recentes</span>
                {onClearRecent && (
                  <button
                    onClick={onClearRecent}
                    className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    Limpar
                  </button>
                )}
              </div>

              {recentSearches.map((search, index) => {
                const itemIndex = currentIndex++;
                return (
                  <button
                    key={`recent-${index}`}
                    onClick={() => handleSelectSuggestion(itemIndex + 1)}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 
                              flex items-center space-x-3 text-sm
                              ${
                                highlightedIndex === itemIndex + 1
                                  ? "bg-gray-50 dark:bg-gray-700"
                                  : ""
                              }`}
                  >
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {search}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Sugestões */}
          {filteredSuggestions.length > 0 && (
            <div>
              {recentSearches.length > 0 && (
                <div
                  className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 
                              border-b border-gray-200 dark:border-gray-700"
                >
                  Sugestões
                </div>
              )}

              {filteredSuggestions.map((suggestion, index) => {
                const itemIndex = currentIndex++;
                const adjustedIndex =
                  recentSearches.length > 0
                    ? itemIndex + recentSearches.length + 1
                    : itemIndex;

                return (
                  <button
                    key={`suggestion-${index}`}
                    onClick={() => handleSelectSuggestion(adjustedIndex)}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 
                              flex items-center space-x-3 text-sm
                              ${
                                highlightedIndex === adjustedIndex
                                  ? "bg-gray-50 dark:bg-gray-700"
                                  : ""
                              }`}
                  >
                    {getIconForSuggestion(suggestion.type)}
                    <div className="flex-1">
                      <div className="text-gray-700 dark:text-gray-300">
                        {getSuggestionLabel(suggestion)}
                      </div>
                      {suggestion.book && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          de {suggestion.book.author}
                        </div>
                      )}
                    </div>
                    {suggestion.count && (
                      <span className="text-xs text-gray-400">
                        {suggestion.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Estado vazio */}
          {value.length > 0 &&
            filteredSuggestions.length === 0 &&
            recentSearches.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhuma sugestão encontrada</p>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
