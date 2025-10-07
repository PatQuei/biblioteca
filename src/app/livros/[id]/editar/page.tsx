"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import BookForm from "../../../../components/components/book-form";
import type { BookFormData } from "../../../types/book";
import { updateBookAPI } from "../../../lib/api-client";

const EditarLivroPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;

  const [bookData, setBookData] = useState<BookFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carregar dados do livro
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/books/${bookId}`);
        const result = await response.json();

        if (result.success) {
          setBookData(result.data);
        } else {
          alert("Erro ao carregar dados do livro");
          router.push("/biblioteca");
        }
      } catch (error) {
        console.error("Erro ao carregar livro:", error);
        alert("Erro ao carregar dados do livro");
        router.push("/biblioteca");
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBook();
    }
  }, [bookId, router]);

  const handleSubmit = async (data: BookFormData) => {
    setIsSubmitting(true);

    try {
      const result = await updateBookAPI(bookId, data);

      if (result.success) {
        alert(result.message);
        router.push(`/biblioteca/${bookId}`);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Erro ao atualizar o livro:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar o livro. Por favor, tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Carregando dados do livro...
          </p>
        </div>
      </div>
    );
  }

  if (!bookData) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Livro não encontrado
          </h1>
          <button
            onClick={() => router.push("/biblioteca")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Voltar à Biblioteca
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Editar Livro
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Atualize as informações do livro &ldquo;{bookData.title}&rdquo;
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => router.push(`/biblioteca/${bookId}`)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mr-2"
        >
          Cancelar
        </button>
      </div>

      <BookForm
        onSubmit={handleSubmit}
        initialData={bookData}
        botaoTexto="Atualizar Livro"
        disabled={isSubmitting}
      />
    </div>
  );
};

export default EditarLivroPage;
