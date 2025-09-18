import { DeleteBookButton } from "@/app/components/delete-book-button";

function deleteBook(id: string) {
  console.log("Livro excluido:", id);
  // Aqui você pode adicionar a lógica para excluir o livro, como uma chamada de API
}
export default function BookDetails({ params }: { params: { id: string } }) {
  const bookId = params.id;
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Detalhes do Livro</h1>
      <p>ID do Livro: {bookId}</p>
      <div className="mt-4">
        <DeleteBookButton bookId={bookId} onDeleteAction={deleteBook} />
      </div>
    </div>
  );
}
