"use client";

import React, { useState } from "react";
import { Plus, Minus, Play, Pause, RotateCcw, CheckCircle } from "lucide-react";
import {
  updateReadingProgressAPI,
  updateBookStatusAPI,
} from "../../app/lib/api-client";
import type { BookStatus } from "../../app/types/book";

interface QuickProgressControlsProps {
  bookId: string;
  currentPage: number;
  totalPages: number;
  status: BookStatus;
  onUpdate?: (newProgress: number, newStatus?: BookStatus) => void;
  compact?: boolean;
}

export function QuickProgressControls({
  bookId,
  currentPage,
  totalPages,
  status,
  onUpdate,
  compact = false,
}: QuickProgressControlsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(currentPage);

  const updateProgress = async (newPage: number, newStatus?: BookStatus) => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      let result;

      if (newStatus) {
        result = await updateBookStatusAPI(bookId, newStatus);
        if (result.success) {
          // Se mudou o status, também atualiza a página se necessário
          const progressResult = await updateReadingProgressAPI(
            bookId,
            newPage
          );
          if (!progressResult.success) {
            throw new Error(progressResult.error);
          }
        }
      } else {
        result = await updateReadingProgressAPI(bookId, newPage);
      }

      if (result.success) {
        setCurrentProgress(newPage);
        onUpdate?.(newPage, newStatus);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Erro ao atualizar progresso:", error);
      alert(
        error instanceof Error ? error.message : "Erro ao atualizar progresso"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePageChange = (delta: number) => {
    const newPage = Math.max(0, Math.min(totalPages, currentProgress + delta));
    updateProgress(newPage);
  };

  const handleStatusChange = async (newStatus: BookStatus) => {
    let newPage = currentProgress;

    if (newStatus === "LIDO") {
      newPage = totalPages;
    } else if (newStatus === "LENDO" && currentProgress === 0) {
      newPage = 1;
    } else if (newStatus === "QUERO_LER" || newStatus === "ABANDONADO") {
      newPage = 0;
    }

    await updateProgress(newPage, newStatus);
  };

  const progressPercentage =
    totalPages > 0 ? (currentProgress / totalPages) * 100 : 0;

  if (compact) {
    return (
      <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handlePageChange(-10);
          }}
          disabled={isUpdating || currentProgress <= 0}
          className="p-1 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Voltar 10 páginas"
        >
          <Minus className="h-3 w-3" />
        </button>

        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 min-w-[60px] text-center">
          {currentProgress}/{totalPages}
        </span>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handlePageChange(10);
          }}
          disabled={isUpdating || currentProgress >= totalPages}
          className="p-1 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Avançar 10 páginas"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 dark:text-white">
          Progresso de Leitura
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {Math.round(progressPercentage)}%
        </span>
      </div>

      {/* Barra de progresso */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
        <div
          className="bg-blue-500 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Controles de páginas */}
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={() => handlePageChange(-1)}
          disabled={isUpdating || currentProgress <= 0}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Página anterior"
        >
          <Minus className="h-4 w-4" />
        </button>

        <div className="text-center">
          <span className="text-lg font-bold text-gray-800 dark:text-white">
            {currentProgress}
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            {" "}
            / {totalPages}
          </span>
        </div>

        <button
          onClick={() => handlePageChange(1)}
          disabled={isUpdating || currentProgress >= totalPages}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Próxima página"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Controles rápidos */}
      <div className="flex justify-center space-x-2">
        <button
          onClick={() => handlePageChange(-10)}
          disabled={isUpdating || currentProgress <= 0}
          className="px-3 py-1 text-xs bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full hover:bg-orange-200 dark:hover:bg-orange-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          -10
        </button>
        <button
          onClick={() => handlePageChange(10)}
          disabled={isUpdating || currentProgress >= totalPages}
          className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          +10
        </button>
        <button
          onClick={() => handlePageChange(25)}
          disabled={isUpdating || currentProgress >= totalPages}
          className="px-3 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full hover:bg-green-200 dark:hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          +25
        </button>
      </div>

      {/* Controles de status */}
      <div className="border-t pt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Ações Rápidas:
        </p>
        <div className="flex flex-wrap gap-2">
          {status !== "LENDO" && (
            <button
              onClick={() => handleStatusChange("LENDO")}
              disabled={isUpdating}
              className="flex items-center space-x-1 px-3 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full hover:bg-yellow-200 dark:hover:bg-yellow-800 disabled:opacity-50 transition-colors"
            >
              <Play className="h-3 w-3" />
              <span>Começar a Ler</span>
            </button>
          )}

          {status === "LENDO" && (
            <button
              onClick={() => handleStatusChange("PAUSADO")}
              disabled={isUpdating}
              className="flex items-center space-x-1 px-3 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 disabled:opacity-50 transition-colors"
            >
              <Pause className="h-3 w-3" />
              <span>Pausar</span>
            </button>
          )}

          {currentProgress > 0 && status !== "LIDO" && (
            <button
              onClick={() => handleStatusChange("LIDO")}
              disabled={isUpdating}
              className="flex items-center space-x-1 px-3 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full hover:bg-green-200 dark:hover:bg-green-800 disabled:opacity-50 transition-colors"
            >
              <CheckCircle className="h-3 w-3" />
              <span>Marcar como Lido</span>
            </button>
          )}

          {currentProgress > 0 && (
            <button
              onClick={() => updateProgress(0, "QUERO_LER")}
              disabled={isUpdating}
              className="flex items-center space-x-1 px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reiniciar</span>
            </button>
          )}
        </div>
      </div>

      {isUpdating && (
        <div className="text-center">
          <span className="text-sm text-blue-600 dark:text-blue-400">
            Atualizando...
          </span>
        </div>
      )}
    </div>
  );
}
