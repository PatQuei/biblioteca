"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import BookForm from '../components/book-form';
import type { BookFormData } from '../types/book';

const AdicionarLivroPage: React.FC = () => {
  const router = useRouter();

  const handleSubmit = async (data: BookFormData) => {
    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar o livro');
      }

      router.push('/biblioteca');
      router.refresh();
    } catch (error) {
      console.error('Erro ao salvar o livro:', error);
      alert('Erro ao salvar o livro. Por favor, tente novamente.');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Adicionar Novo Livro</h1>
      <BookForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AdicionarLivroPage;
