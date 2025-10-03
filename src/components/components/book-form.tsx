import React, { useState, useEffect } from "react";
import Image from "next/image";
import type { BookFormData, BookStatus, Genre } from "../../app/types/book";

interface BookFormProps {
  onSubmit: (data: BookFormData) => void;
  initialData?: BookFormData;
  botaoTexto?: string;
  disabled?: boolean;
}

const BookForm: React.FC<BookFormProps> = ({
  onSubmit,
  initialData,
  botaoTexto = "Salvar",
  disabled = false,
}) => {
  const [formState, setFormState] = useState<BookFormData>({
    title: initialData?.title || "",
    author: initialData?.author || "",
    genreId: initialData?.genreId || "",
    year: initialData?.year || new Date().getFullYear(),
    pages: initialData?.pages || 0,
    rating: initialData?.rating || 0,
    synopsis: initialData?.synopsis || "",
    cover: initialData?.cover || "",
    status: initialData?.status || "QUERO_LER",
    currentPage: initialData?.currentPage || 0,
    isbn: initialData?.isbn || "",
    notes: initialData?.notes || "",
  });

  const [genres, setGenres] = useState<Genre[]>([]);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [progress, setProgress] = useState(0);

  // Carregar gêneros
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        if (data.success) {
          setGenres(data.data);
        }
      } catch (error) {
        console.error("Erro ao carregar gêneros:", error);
      } finally {
        setLoadingGenres(false);
      }
    };

    fetchGenres();
  }, []);

  // Calcular progresso do formulário
  useEffect(() => {
    const requiredFields = ["title", "author", "genreId"];
    const filledRequired = requiredFields.filter(
      (field) => formState[field as keyof BookFormData]
    ).length;
    const totalRequired = requiredFields.length;

    const optionalFields = [
      "year",
      "pages",
      "synopsis",
      "cover",
      "isbn",
      "notes",
    ];
    const filledOptional = optionalFields.filter((field) => {
      const value = formState[field as keyof BookFormData];
      return value !== null && value !== undefined && value !== "";
    }).length;
    const totalOptional = optionalFields.length;

    const progressPercent =
      (filledRequired / totalRequired) * 70 +
      (filledOptional / totalOptional) * 30;
    setProgress(Math.round(progressPercent));
  }, [formState]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    // Conversão para números quando necessário
    let finalValue: string | number = value;
    if (type === "number") {
      finalValue = value === "" ? 0 : parseInt(value);
    }

    setFormState((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!formState.title || !formState.author || !formState.genreId) {
      alert(
        "Por favor, preencha os campos obrigatórios: Título, Autor e Gênero"
      );
      return;
    }

    onSubmit(formState);
  };

  const statusOptions: { value: BookStatus; label: string }[] = [
    { value: "QUERO_LER", label: "Quero Ler" },
    { value: "LENDO", label: "Lendo" },
    { value: "LIDO", label: "Lido" },
    { value: "PAUSADO", label: "Pausado" },
    { value: "ABANDONADO", label: "Abandonado" },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto space-y-6 p-6 bg-white dark:bg-gray-800 border rounded-lg shadow-md"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-2">
          {initialData ? "Editar Livro" : "Adicionar Novo Livro"}
        </h2>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {progress}% preenchido
        </span>
      </div>

      {/* Campos obrigatórios */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">
          Informações Básicas *
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="title"
              className="font-semibold text-gray-700 dark:text-gray-300"
            >
              Título *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formState.title}
              onChange={handleChange}
              placeholder="Digite o título do livro"
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="author"
              className="font-semibold text-gray-700 dark:text-gray-300"
            >
              Autor *
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formState.author}
              onChange={handleChange}
              placeholder="Digite o nome do autor"
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="genreId"
              className="font-semibold text-gray-700 dark:text-gray-300"
            >
              Gênero *
            </label>
            <select
              id="genreId"
              name="genreId"
              value={formState.genreId}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              disabled={loadingGenres}
            >
              <option value="">
                {loadingGenres ? "Carregando..." : "Selecione um gênero"}
              </option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="year"
              className="font-semibold text-gray-700 dark:text-gray-300"
            >
              Ano de Publicação
            </label>
            <input
              type="number"
              id="year"
              name="year"
              value={formState.year}
              onChange={handleChange}
              min="1000"
              max={new Date().getFullYear() + 5}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </div>

      {/* Detalhes do livro */}
      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-3">
          Detalhes do Livro
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="pages"
              className="font-semibold text-gray-700 dark:text-gray-300"
            >
              Total de Páginas
            </label>
            <input
              type="number"
              id="pages"
              name="pages"
              value={formState.pages}
              onChange={handleChange}
              min="0"
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="rating"
              className="font-semibold text-gray-700 dark:text-gray-300"
            >
              Avaliação (0-5)
            </label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={formState.rating}
              onChange={handleChange}
              min="0"
              max="5"
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="isbn"
              className="font-semibold text-gray-700 dark:text-gray-300"
            >
              ISBN
            </label>
            <input
              type="text"
              id="isbn"
              name="isbn"
              value={formState.isbn}
              onChange={handleChange}
              placeholder="978-3-16-148410-0"
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <label
            htmlFor="cover"
            className="font-semibold text-gray-700 dark:text-gray-300"
          >
            URL da Capa
          </label>
          <input
            type="url"
            id="cover"
            name="cover"
            value={formState.cover}
            onChange={handleChange}
            placeholder="https://exemplo.com/capa-do-livro.jpg"
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {formState.cover && (
            <div className="mt-2 flex justify-center">
              <Image
                src={formState.cover}
                alt="Preview da capa"
                width={128}
                height={192}
                className="object-cover border rounded shadow-md"
                onError={() => {
                  // Handle error silently
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Status e progresso */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-3">
          Status de Leitura
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="status"
              className="font-semibold text-gray-700 dark:text-gray-300"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formState.status}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {formState.status === "LENDO" && (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="currentPage"
                className="font-semibold text-gray-700 dark:text-gray-300"
              >
                Página Atual
              </label>
              <input
                type="number"
                id="currentPage"
                name="currentPage"
                value={formState.currentPage}
                onChange={handleChange}
                min="0"
                max={formState.pages || undefined}
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          )}
        </div>
      </div>

      {/* Sinopse e notas */}
      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-3">
          Descrição
        </h3>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="synopsis"
              className="font-semibold text-gray-700 dark:text-gray-300"
            >
              Sinopse
            </label>
            <textarea
              id="synopsis"
              name="synopsis"
              value={formState.synopsis}
              onChange={handleChange}
              placeholder="Descreva brevemente o enredo do livro..."
              rows={3}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="notes"
              className="font-semibold text-gray-700 dark:text-gray-300"
            >
              Minhas Anotações
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formState.notes}
              onChange={handleChange}
              placeholder="Suas impressões, citações favoritas, reflexões..."
              rows={3}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
        disabled={
          disabled ||
          !formState.title ||
          !formState.author ||
          !formState.genreId
        }
      >
        {disabled ? "Salvando..." : botaoTexto}
      </button>

      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
        * Campos obrigatórios
      </p>
    </form>
  );
};

export default BookForm;
