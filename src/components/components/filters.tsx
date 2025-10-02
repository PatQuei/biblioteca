'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function Filters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleFilterChange = (type: 'status' | 'genre', value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'todos') {
      params.set(type, value);
    } else {
      params.delete(type);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  // Exemplo - Idealmente viria do banco de dados
  const statuses = ['todos', 'QUERO_LER', 'LENDO', 'LIDO', 'PAUSADO', 'ABANDONADO'];
  const genres = ['todos', 'Ficção', 'Não-Ficção', 'Fantasia', 'Suspense', 'Romance'];

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Filtro por Status */}
      <div>
        <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
        <select
          id="status-filter"
          className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
          onChange={(e) => handleFilterChange('status', e.target.value)}
          defaultValue={searchParams.get('status')?.toString() || 'todos'}
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase().replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Filtro por Gênero */}
      <div>
        <label htmlFor="genre-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gênero</label>
        <select
          id="genre-filter"
          className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
          onChange={(e) => handleFilterChange('genre', e.target.value)}
          defaultValue={searchParams.get('genre')?.toString() || 'todos'}
        >
          {genres.map((genre) => (
            <option key={genre} value={genre.toLowerCase()}>{genre}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

