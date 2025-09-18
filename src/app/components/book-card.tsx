import { DeleteBookButton } from "./delete-book-button";
import Image from "next/image";

type Book = {
  id: string;
  cover?: string;
  title: string;
  author: string;
  // Add other fields as needed
};

export function BookCard({
  book,
  onDeleteAction,
}: {
  book: Book;
  onDeleteAction: (id: string) => void;
}) {
  return (
    <div>
      <Image
        src={book.cover || "/default-cover.jpg"}
        alt={book.title}
        width={400}
        height={192}
        className="w-full h-48 object-cover mb-4 rounded"
        priority
      />
      <h3 className="text-xl font-bold">{book.title}</h3>
      <p className="text-gray-600">Autor: {book.author}</p>
      <div className="flex justify-between items-center mt-4">
        <DeleteBookButton bookId={book.id} onDeleteAction={onDeleteAction} />
        <DeleteBookButton
          bookId={book.id}
          onDeleteAction={() => onDeleteAction(book.title)}
        />
      </div>
    </div>
  );
}
