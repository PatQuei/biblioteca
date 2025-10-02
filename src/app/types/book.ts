export interface Book {
  id?: string;
  title: string;
  author: string;
  cover?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type BookFormData = Omit<Book, 'id' | 'createdAt' | 'updatedAt'>;
