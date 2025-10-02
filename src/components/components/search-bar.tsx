export const SearchBar = () => {
  return (
    <div className="w-full max-w-md">
      <input
        type="text"
        placeholder="Pesquisar..."
        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                   bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                   placeholder-gray-400 dark:placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                   transition-colors"
      />
    </div>
  );
};
