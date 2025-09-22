import BookForm from "@/components/book-form";

export default function AdicionarPage() {
  const handleAddBook = (data: any) => {
    console.log("Novo livro adicionado:", data);
    alert("Livro cadastrado com sucesso!");
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Adicionar Livro</h1>
      <BookForm onSubmit={handleAddBook} />
    </div>
  );
}
