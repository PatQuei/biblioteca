export const StatsCard = ({ label, value }: { label: string; value: number }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center transition-colors">
      <p className="text-gray-600 dark:text-gray-300">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
    </div>
  );
};
