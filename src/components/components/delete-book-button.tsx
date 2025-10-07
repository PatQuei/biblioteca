"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteBookAPI } from "../../app/lib/api-client";

interface DeleteBookButtonProps {
  bookId: string;
  bookTitle: string;
  disabled?: boolean;
  onDelete?: () => void;
  className?: string;
}

export default function DeleteBookButton({
  bookId,
  bookTitle,
  disabled = false,
  onDelete,
  className = "",
}: DeleteBookButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleConfirm = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteBookAPI(bookId);

      if (result.success) {
        setIsOpen(false);
        if (onDelete) {
          onDelete();
        } else {
          router.push("/biblioteca");
        }
        alert(result.message);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Erro ao deletar livro:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Erro ao deletar o livro. Por favor, tente novamente."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        disabled={disabled || isDeleting}
        onClick={() => setIsOpen(true)}
        className={`bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed ${className}`}
      >
        {isDeleting ? "Excluindo..." : "Excluir Livro"}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                <svg
                  className="h-6 w-6 text-red-600 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Confirmar Exclusão
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Tem certeza que deseja excluir o livro &ldquo;
                <strong>{bookTitle}</strong>&rdquo;? Esta ação não pode ser
                desfeita.
              </p>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleConfirm}
                  disabled={isDeleting}
                  className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
                >
                  {isDeleting ? "Excluindo..." : "Sim, Excluir"}
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  disabled={isDeleting}
                  className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
