export const Filters = () => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex items-center space-x-4 transition-colors">
      <input
        type="text"
        placeholder="Pesquisar..."
        className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      />
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded dark:bg-blue-500 dark:hover:bg-blue-600">
        Buscar
      </button>
    </div>
  );
};

