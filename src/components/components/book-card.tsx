export const BookCard = ({ title, author }: { title: string; author: string }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 transition-colors">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{author}</p>
    </div>
  );
};
