"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BookForm from "../../components/components/book-form";
import type { BookFormData } from "../types/book";
import { createBook } from "../actions/books";

const AdicionarLivroPage: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: BookFormData) => {
    setIsSubmitting(true);

    try {
      // Criar FormData para a Server Action
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("author", data.author);
      formData.append("genreId", data.genreId);
      formData.append(
        "year",
        (data.year || new Date().getFullYear()).toString()
      );
      formData.append("pages", (data.pages || 0).toString());
      formData.append("rating", (data.rating || 0).toString());
      formData.append("synopsis", data.synopsis || "");
      formData.append("cover", data.cover || "");
      formData.append("status", data.status || "QUERO_LER");
      formData.append("isbn", data.isbn || "");
      formData.append("notes", data.notes || "");

      const result = await createBook(formData);

      if (result.success) {
        alert(result.message);
        router.push("/biblioteca");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Erro ao salvar o livro:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Erro ao salvar o livro. Por favor, tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Adicionar Novo Livro
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Preencha as informações do livro que deseja adicionar à sua biblioteca
        </p>
      </div>
      <BookForm onSubmit={handleSubmit} disabled={isSubmitting} />
    </div>
  );
};

export default AdicionarLivroPage;
