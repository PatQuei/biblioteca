<<<<<<< HEAD
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Book } from '../types/book';
import BookCard from '../components/book-card';

export default function BibliotecaPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch('/api/books');
        if (!response.ok) {
          throw new Error('Erro ao carregar os livros');
        }
        const data = await response.json();
        setBooks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar os livros');
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto mt-10 p-4 bg-red-50 border border-red-200 rounded-md">
        <h2 className="text-red-700 font-semibold">Erro</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Biblioteca</h1>
        <Link
          href="/adicionar"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Adicionar Livro
        </Link>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">Nenhum livro cadastrado ainda.</p>
          <Link
            href="/adicionar"
            className="mt-4 inline-block text-blue-500 hover:text-blue-600"
          >
            Comece adicionando um livro →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <Link key={book.id} href={`/livros/${book.id}`}>
              <BookCard book={book} />
            </Link>
          ))}
=======
import { BookCard } from "../../components/components/book-card";
import { Filters } from "../../components/components/filters";
import { SearchBar } from "../../components/components/search-bar";
import prisma from "src/app/lib/prisma";

// Esta página agora é um Server Component que busca dados
export default async function BibliotecaPage() {
  // Busca os livros do banco de dados
  const books = await prisma.book.findMany({
    orderBy: {
      createdAt: 'desc', // Ordena pelos mais recentes
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Minha Biblioteca</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Gerencie e explore sua coleção de livros.</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <SearchBar placeholder="Buscar por título ou autor..." />
        <Filters />
      </div>

      {books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Nenhum livro encontrado. Tente adicionar um livro primeiro!</p>
>>>>>>> main
        </div>
      )}
    </div>
  );
}
<<<<<<< HEAD
=======

>>>>>>> main
