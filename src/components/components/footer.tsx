export const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-center py-4 transition-colors">
      <p className="text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} BookShelf. Todos os direitos reservados.
      </p>
    </footer>
  );
};
