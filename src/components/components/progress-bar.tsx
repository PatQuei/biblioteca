import React from "react";

interface ProgressBarProps {
  current: number;
  total: number;
  label: string;
  color?: string;
  showPercentage?: boolean;
  height?: string;
}

export function ProgressBar({
  current,
  total,
  label,
  color = "bg-blue-500",
  showPercentage = true,
  height = "h-2",
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
        {showPercentage && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {percentage}%
          </span>
        )}
      </div>

      <div
        className={`w-full ${height} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}
      >
        <div
          className={`${height} ${color} rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{current.toLocaleString()}</span>
        <span>{total.toLocaleString()}</span>
      </div>
    </div>
  );
}
