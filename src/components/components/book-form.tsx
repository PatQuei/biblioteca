export const BookForm = () => {
  return (
    <form className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-4 transition-colors">
      <div>
        <label className="block text-gray-700 dark:text-gray-300">Título</label>
        <input
          type="text"
          className="w-full mt-1 p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>
      <div>
        <label className="block text-gray-700 dark:text-gray-300">Autor</label>
        <input
          type="text"
          className="w-full mt-1 p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        Adicionar
      </button>
    </form>
  );
};
