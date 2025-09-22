import React from 'react';
import BookForm from '@/components/book-form';

const AdicionarLivroPage: React.FC = () => {
  const handleSubmit = (data: any) => {
    console.log('Dados enviados:', data);
    alert('Livro salvo com sucesso! ✅');
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Adicionar Novo Livro</h1>
      <BookForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AdicionarLivroPage;
