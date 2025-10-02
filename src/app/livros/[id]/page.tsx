"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import BookForm from "../../components/book-form";
import DeleteBookButton from "../../components/delete-book-button";
import type { BookFormData } from "../../types/book";

export default function EditarLivroPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [book, setBook] = useState<BookFormData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBook() {
      try {
        const response = await fetch(`/api/books?id=${id}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Livro não encontrado');
        }
        const data = await response.json();
        setBook(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar o livro');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchBook();
    }
  }, [id]);

  async function handleSubmit(data: BookFormData) {
    try {
      setSubmitting(true);
      setError(null);
      
      const response = await fetch(`/api/books?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao atualizar o livro');
      }

      await router.push("/biblioteca");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar o livro');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-4 bg-red-50 border border-red-200 rounded-md">
        <h2 className="text-red-700 font-semibold">Erro</h2>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => router.push("/biblioteca")}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Voltar
        </button>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h2 className="text-yellow-700 font-semibold">Livro não encontrado</h2>
        <button 
          onClick={() => router.push("/biblioteca")}
          className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
        >
          Voltar para Biblioteca
        </button>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      setSubmitting(true);
      const response = await fetch(`/api/books?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao excluir o livro');
      }

      router.push('/biblioteca');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir o livro');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6">Editar Livro</h1>
      <div className="mb-6 flex items-center justify-end space-x-4">
        <Link href={`/livros/${id}/editar`} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
          Editar Livro
        </Link>
      </div>
      <BookForm
        initialData={book}
        onSubmit={handleSubmit}
        botaoTexto={submitting ? "Salvando..." : "Salvar Alterações"}
        disabled={submitting}
      />
      <div className="mt-8 border-t pt-6">
        <p className="text-gray-600 mb-4">
          Aviso: Esta exclusão não pode ser revertida.
        </p>
        <DeleteBookButton onDelete={handleDelete} disabled={submitting} />
      </div>
    </div>
  );
}
