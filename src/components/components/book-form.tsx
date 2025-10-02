import React, { useState, useEffect } from 'react';
import type { BookFormData } from '../types/book';

interface BookFormProps {
  onSubmit: (data: BookFormData) => void;
  initialData?: BookFormData;
  botaoTexto?: string;
  disabled?: boolean;
}

const BookForm: React.FC<BookFormProps> = ({ onSubmit, initialData, botaoTexto = "Salvar", disabled = false }) => {
  const [formState, setFormState] = useState<BookFormData>({
    title: initialData?.title || '',
    author: initialData?.author || '',
    cover: initialData?.cover || '',
    description: initialData?.description || '',
  });

  const [progress, setProgress] = useState(0);

  // Atualiza progresso conforme campos são preenchidos
  useEffect(() => {
    const totalFields = 4;
    const filledFields = Object.values(formState).filter(v => v).length;
    setProgress((filledFields / totalFields) * 100);

    // Debug do estado do formulário
    console.log('Form state:', formState);
  }, [formState]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formState);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6 p-6 bg-white border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">Editar Livro</h2>
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="font-semibold text-gray-700">Título *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formState.title}
          onChange={handleChange}
          placeholder="Digite o título do livro"
          className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="author" className="font-semibold text-gray-700">Autor *</label>
        <input
          type="text"
          id="author"
          name="author"
          value={formState.author}
          onChange={handleChange}
          placeholder="Digite o nome do autor"
          className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="cover" className="font-semibold text-gray-700">Capa (URL)</label>
        <input
          type="text"
          id="cover"
          name="cover"
          value={formState.cover}
          onChange={handleChange}
          placeholder="Cole a URL da capa do livro"
          className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {formState.cover && (
          <img
            src={formState.cover}
            alt="Preview da capa"
            className="mt-2 w-40 h-60 object-cover border rounded mx-auto"
          />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="font-semibold text-gray-700">Resumo/Descrição</label>
        <textarea
          id="description"
          name="description"
          value={formState.description}
          onChange={handleChange}
          placeholder="Opcional: escreva uma breve descrição do livro"
          className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={4}
        />
      </div>

      <div className="h-2 bg-gray-200 rounded">
        <div
          className="h-2 bg-green-500 rounded"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-sm text-gray-500">{Math.round(progress)}% preenchido</span>

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disabled}
      >
        {botaoTexto}
      </button>
    </form>
  );
};

export default BookForm;
