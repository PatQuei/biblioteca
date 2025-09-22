import React, { useState, useEffect } from 'react';

interface BookFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

const BookForm: React.FC<BookFormProps> = ({ onSubmit, initialData }) => {
  const [formState, setFormState] = useState({
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
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md shadow-sm">
      <div>
        <label className="block font-medium">Título *</label>
        <input
          type="text"
          name="title"
          value={formState.title}
          onChange={handleChange}
          placeholder="Digite o título do livro..."
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Autor *</label>
        <input
          type="text"
          name="author"
          value={formState.author}
          onChange={handleChange}
          placeholder="Digite o nome do autor..."
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Capa (URL)</label>
        <input
          type="text"
          name="cover"
          value={formState.cover}
          onChange={handleChange}
          placeholder="Cole a URL da capa do livro"
          className="w-full border p-2 rounded"
        />
        {formState.cover && (
          <img
            src={formState.cover}
            alt="Preview da capa"
            className="mt-2 w-40 h-60 object-cover border"
          />
        )}
      </div>

      <div>
        <label className="block font-medium">Descrição</label>
        <textarea
          name="description"
          value={formState.description}
          onChange={handleChange}
          placeholder="Opcional: escreva uma breve descrição do livro"
          className="w-full border p-2 rounded"
          rows={3}
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
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Salvar
      </button>
    </form>
  );
};

export default BookForm;
