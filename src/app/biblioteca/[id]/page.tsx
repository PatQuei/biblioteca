import prisma from "src/app/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Book as BookIcon,
  Calendar,
  Hash,
  Notebook,
  Star,
  Tag,
  Edit,
} from "lucide-react";
import DeleteBookButton from "../../../components/components/delete-book-button";

// Esta função busca os dados do livro no servidor
async function getBook(id: string) {
  const book = await prisma.book.findUnique({
    where: { id },
    include: {
      genre: true,
    },
  });

  if (!book) {
    notFound();
  }
  return book;
}

export default async function BookDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const book = await getBook(id);

  const progress = book.pages > 0 ? (book.currentPage / book.pages) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <Image
              className="h-96 w-full object-cover md:w-64"
              src={
                book.cover ||
                `https://placehold.co/300x400/cccccc/333333?text=${book.title.charAt(
                  0
                )}`
              }
              alt={`Capa do livro ${book.title}`}
              width={256}
              height={384}
              priority
            />
          </div>
          <div className="p-8 flex-grow">
            <div className="uppercase tracking-wide text-sm text-indigo-500 dark:text-indigo-400 font-semibold">
              {book.genre.name}
            </div>
            <h1 className="block mt-1 text-3xl leading-tight font-extrabold text-black dark:text-white">
              {book.title}
            </h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400 text-lg">
              {book.author}
            </p>

            <div className="flex items-center mt-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-6 w-6 ${
                    i < book.rating
                      ? "text-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                  fill={i < book.rating ? "currentColor" : "none"}
                />
              ))}
              <span className="ml-2 text-gray-600 dark:text-gray-300">
                ({book.rating} de 5)
              </span>
            </div>

            <div className="mt-6 space-y-3 text-gray-700 dark:text-gray-300">
              <div className="flex items-center">
                <Tag className="h-5 w-5 mr-3 text-gray-500" />
                <span>
                  Status:{" "}
                  <span className="font-semibold">
                    {book.status.replace("_", " ")}
                  </span>
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-3 text-gray-500" />
                <span>
                  Ano: <span className="font-semibold">{book.year}</span>
                </span>
              </div>
              <div className="flex items-center">
                <BookIcon className="h-5 w-5 mr-3 text-gray-500" />
                <span>
                  Páginas: <span className="font-semibold">{book.pages}</span>
                </span>
              </div>
              {book.isbn && (
                <div className="flex items-center">
                  <Hash className="h-5 w-5 mr-3 text-gray-500" />
                  <span>
                    ISBN: <span className="font-semibold">{book.isbn}</span>
                  </span>
                </div>
              )}
            </div>

            {book.status === "LENDO" && (
              <div className="mt-6">
                <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  <span>Progresso da Leitura</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Botões de Ação */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/livros/${book.id}/editar`}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Editar Livro
              </Link>

              <DeleteBookButton
                bookId={book.id}
                bookTitle={book.title}
                className="flex items-center gap-2"
              />

              <Link
                href="/biblioteca"
                className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Voltar à Biblioteca
              </Link>
            </div>
          </div>
        </div>
        {(book.synopsis || book.notes) && (
          <div className="p-8 border-t border-gray-200 dark:border-gray-700">
            {book.synopsis && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Sinopse
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {book.synopsis}
                </p>
              </div>
            )}
            {book.notes && (
              <div className="mt-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Minhas Anotações
                </h2>
                <div className="mt-2 text-gray-600 dark:text-gray-400 p-4 border rounded-md bg-gray-50 dark:bg-gray-900/50">
                  <Notebook className="h-5 w-5 inline-block mr-2 align-text-bottom" />
                  <p className="inline">{book.notes}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
