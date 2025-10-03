'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from './useDebounce';
import { Book } from '../types/book';

export interface SearchFilters {
  search: string;
  genre: string;
  status: string | string[];
  rating: {
    min: number;
    max: number;
  };
  year: {
    min: number;
    max: number;
  };
  author: string;
  pages: {
    min: number;
    max: number;
  };
}

export interface SortOption {
  field: 'title' | 'author' | 'year' | 'rating' | 'pages' | 'createdAt' | 'updatedAt';
  direction: 'asc' | 'desc';
}

export interface SearchState {
  filters: SearchFilters;
  sortBy: SortOption;
  page: number;
  limit: number;
  isLoading: boolean;
  results: Book[];
  totalCount: number;
  error: string | null;
}

export interface SavedFilter {
  id: string;
  name: string;
  filters: Partial<SearchFilters>;
  sortBy?: SortOption;
  createdAt: Date;
}

const DEFAULT_FILTERS: SearchFilters = {
  search: '',
  genre: '',
  status: '',
  rating: { min: 0, max: 5 },
  year: { min: 1900, max: new Date().getFullYear() },
  author: '',
  pages: { min: 0, max: 2000 }
};

const DEFAULT_SORT: SortOption = {
  field: 'createdAt',
  direction: 'desc'
};

export function useAdvancedSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Estado principal
  const [state, setState] = useState<SearchState>({
    filters: DEFAULT_FILTERS,
    sortBy: DEFAULT_SORT,
    page: 1,
    limit: 20,
    isLoading: false,
    results: [],
    totalCount: 0,
    error: null
  });

  // Estado para filtros salvos
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);

  // Debounce para busca de texto
  const debouncedSearch = useDebounce(state.filters.search, 300);

  // Carregrar filtros salvos do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('biblioteca-saved-filters');
    if (saved) {
      try {
        setSavedFilters(JSON.parse(saved));
      } catch (error) {
        console.error('Erro ao carregar filtros salvos:', error);
      }
    }
  }, []);

  // Sincronizar com URL params na inicialização
  useEffect(() => {
    const urlFilters: Partial<SearchFilters> = {};
    const urlSort: Partial<SortOption> = {};

    // Extrair filtros da URL
    if (searchParams.get('search')) urlFilters.search = searchParams.get('search')!;
    if (searchParams.get('genre')) urlFilters.genre = searchParams.get('genre')!;
    if (searchParams.get('status')) {
      const status = searchParams.get('status')!;
      urlFilters.status = status.includes(',') ? status.split(',') : status;
    }
    if (searchParams.get('author')) urlFilters.author = searchParams.get('author')!;
    
    // Ratings
    if (searchParams.get('minRating') || searchParams.get('maxRating')) {
      urlFilters.rating = {
        min: parseInt(searchParams.get('minRating') || '0'),
        max: parseInt(searchParams.get('maxRating') || '5')
      };
    }

    // Anos
    if (searchParams.get('minYear') || searchParams.get('maxYear')) {
      urlFilters.year = {
        min: parseInt(searchParams.get('minYear') || '1900'),
        max: parseInt(searchParams.get('maxYear') || new Date().getFullYear().toString())
      };
    }

    // Páginas
    if (searchParams.get('minPages') || searchParams.get('maxPages')) {
      urlFilters.pages = {
        min: parseInt(searchParams.get('minPages') || '0'),
        max: parseInt(searchParams.get('maxPages') || '2000')
      };
    }

    // Ordenação
    if (searchParams.get('sortBy')) {
      urlSort.field = searchParams.get('sortBy') as SortOption['field'];
    }
    if (searchParams.get('sortDir')) {
      urlSort.direction = searchParams.get('sortDir') as SortOption['direction'];
    }

    // Paginação
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (Object.keys(urlFilters).length > 0 || Object.keys(urlSort).length > 0 || page !== 1 || limit !== 20) {
      setState(prev => ({
        ...prev,
        filters: { ...prev.filters, ...urlFilters },
        sortBy: { ...prev.sortBy, ...urlSort },
        page,
        limit
      }));
    }
  }, [searchParams]);

  // Atualizar URL quando filtros mudarem
  const updateUrl = useCallback((
    filters: Partial<SearchFilters>, 
    sortBy?: Partial<SortOption>, 
    page?: number,
    limit?: number
  ) => {
    const params = new URLSearchParams();

    // Adicionar filtros não vazios
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== DEFAULT_FILTERS[key as keyof SearchFilters]) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          // Para ranges (rating, year, pages)
          if (key === 'rating' && (value.min !== 0 || value.max !== 5)) {
            if (value.min > 0) params.set('minRating', value.min.toString());
            if (value.max < 5) params.set('maxRating', value.max.toString());
          } else if (key === 'year' && (value.min !== 1900 || value.max !== new Date().getFullYear())) {
            if (value.min > 1900) params.set('minYear', value.min.toString());
            if (value.max < new Date().getFullYear()) params.set('maxYear', value.max.toString());
          } else if (key === 'pages' && (value.min !== 0 || value.max !== 2000)) {
            if (value.min > 0) params.set('minPages', value.min.toString());
            if (value.max < 2000) params.set('maxPages', value.max.toString());
          }
        } else if (Array.isArray(value) && value.length > 0) {
          params.set(key, value.join(','));
        } else if (typeof value === 'string' && value.trim()) {
          params.set(key, value);
        }
      }
    });

    // Adicionar ordenação se diferente do padrão
    if (sortBy?.field && sortBy.field !== DEFAULT_SORT.field) {
      params.set('sortBy', sortBy.field);
    }
    if (sortBy?.direction && sortBy.direction !== DEFAULT_SORT.direction) {
      params.set('sortDir', sortBy.direction);
    }

    // Adicionar paginação se diferente do padrão
    if (page && page !== 1) params.set('page', page.toString());
    if (limit && limit !== 20) params.set('limit', limit.toString());

    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.push(`/biblioteca${newUrl}`, { scroll: false });
  }, [router]);

  // Executar busca na API
  const executeSearch = useCallback(async (
    filters: SearchFilters,
    sortBy: SortOption,
    page: number = 1,
    limit: number = 20
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const params = new URLSearchParams();
      
      // Filtros de busca
      if (filters.search) params.set('search', filters.search);
      if (filters.genre) params.set('genre', filters.genre);
      if (filters.author) params.set('author', filters.author);
      
      // Status (pode ser múltiplo)
      if (filters.status) {
        const statusParam = Array.isArray(filters.status) ? filters.status.join(',') : filters.status;
        if (statusParam) params.set('status', statusParam);
      }

      // Ranges
      if (filters.rating.min > 0) params.set('minRating', filters.rating.min.toString());
      if (filters.rating.max < 5) params.set('maxRating', filters.rating.max.toString());
      if (filters.year.min > 1900) params.set('minYear', filters.year.min.toString());
      if (filters.year.max < new Date().getFullYear()) params.set('maxYear', filters.year.max.toString());
      if (filters.pages.min > 0) params.set('minPages', filters.pages.min.toString());
      if (filters.pages.max < 2000) params.set('maxPages', filters.pages.max.toString());

      // Ordenação
      params.set('sortBy', sortBy.field);
      params.set('sortDir', sortBy.direction);
      
      // Paginação
      params.set('page', page.toString());
      params.set('limit', limit.toString());

      const response = await fetch(`/api/books?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setState(prev => ({
          ...prev,
          results: data.data || [],
          totalCount: data.totalCount || data.count || 0,
          isLoading: false
        }));
      } else {
        throw new Error(data.error || 'Erro ao buscar livros');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        isLoading: false,
        results: [],
        totalCount: 0
      }));
    }
  }, []);

  // Executar busca quando filtros relevantes mudarem
  useEffect(() => {
    // Apenas executar quando debouncedSearch estiver sincronizado
    if (debouncedSearch === state.filters.search) {
      executeSearch(state.filters, state.sortBy, state.page, state.limit);
    }
  }, [debouncedSearch, state.filters, state.sortBy, state.page, state.limit, executeSearch]);

  // Ações para atualizar filtros
  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setState(prev => {
      const updatedFilters = { ...prev.filters, ...newFilters };
      updateUrl(updatedFilters, prev.sortBy, 1); // Reset to page 1 when filters change
      return {
        ...prev,
        filters: updatedFilters,
        page: 1
      };
    });
  }, [updateUrl]);

  const updateSort = useCallback((newSort: Partial<SortOption>) => {
    setState(prev => {
      const updatedSort = { ...prev.sortBy, ...newSort };
      updateUrl(prev.filters, updatedSort, 1); // Reset to page 1 when sort changes
      return {
        ...prev,
        sortBy: updatedSort,
        page: 1
      };
    });
  }, [updateUrl]);

  const updatePage = useCallback((page: number) => {
    setState(prev => {
      updateUrl(prev.filters, prev.sortBy, page, prev.limit);
      return { ...prev, page };
    });
  }, [updateUrl]);

  const updateLimit = useCallback((limit: number) => {
    setState(prev => {
      updateUrl(prev.filters, prev.sortBy, 1, limit); // Reset to page 1 when limit changes
      return { ...prev, limit, page: 1 };
    });
  }, [updateUrl]);

  // Limpar todos os filtros
  const clearFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      filters: DEFAULT_FILTERS,
      sortBy: DEFAULT_SORT,
      page: 1
    }));
    router.push('/biblioteca');
  }, [router]);

  // Salvar filtro atual
  const saveCurrentFilter = useCallback((name: string) => {
    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name,
      filters: state.filters,
      sortBy: state.sortBy,
      createdAt: new Date()
    };

    const updated = [...savedFilters, newFilter];
    setSavedFilters(updated);
    localStorage.setItem('biblioteca-saved-filters', JSON.stringify(updated));
  }, [state.filters, state.sortBy, savedFilters]);

  // Aplicar filtro salvo
  const applySavedFilter = useCallback((filter: SavedFilter) => {
    setState(prev => ({
      ...prev,
      filters: { ...DEFAULT_FILTERS, ...filter.filters },
      sortBy: filter.sortBy || DEFAULT_SORT,
      page: 1
    }));
    updateUrl(filter.filters, filter.sortBy, 1);
  }, [updateUrl]);

  // Remover filtro salvo
  const removeSavedFilter = useCallback((filterId: string) => {
    const updated = savedFilters.filter(f => f.id !== filterId);
    setSavedFilters(updated);
    localStorage.setItem('biblioteca-saved-filters', JSON.stringify(updated));
  }, [savedFilters]);

  // Estatísticas dos resultados
  const stats = useMemo(() => {
    const { results, totalCount, filters, sortBy } = state;
    
    return {
      total: totalCount,
      showing: results.length,
      genreDistribution: results.reduce((acc, book) => {
        const genre = book.genre?.name || 'Sem gênero';
        acc[genre] = (acc[genre] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      statusDistribution: results.reduce((acc, book) => {
        acc[book.status] = (acc[book.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      averageRating: results.length > 0 
        ? results.reduce((sum, book) => sum + (book.rating || 0), 0) / results.length 
        : 0,
      hasFiltersApplied: Object.entries(filters).some(([key, value]) => {
        const defaultValue = DEFAULT_FILTERS[key as keyof SearchFilters];
        if (typeof value === 'object' && !Array.isArray(value)) {
          return JSON.stringify(value) !== JSON.stringify(defaultValue);
        }
        return value !== defaultValue;
      }) || sortBy.field !== DEFAULT_SORT.field || sortBy.direction !== DEFAULT_SORT.direction
    };
  }, [state]);

  return {
    // Estado atual
    ...state,
    
    // Ações
    updateFilters,
    updateSort,
    updatePage,
    updateLimit,
    clearFilters,
    executeSearch: () => executeSearch(state.filters, state.sortBy, state.page, state.limit),
    
    // Filtros salvos
    savedFilters,
    saveCurrentFilter,
    applySavedFilter,
    removeSavedFilter,
    
    // Estatísticas
    stats,
    
    // Utilitários
    isSearchActive: state.filters.search.length > 0,
    hasActiveFilters: stats.hasFiltersApplied,
    totalPages: Math.ceil(state.totalCount / state.limit),
    
    // Constantes úteis
    DEFAULT_FILTERS,
    DEFAULT_SORT
  };
}