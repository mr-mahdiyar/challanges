"use client";

import { useEffect, useOptimistic, useState, useTransition } from "react";

interface Book {
  name: string;
  pageNumbers: number;
}
const newBooks: Array<Book> = [
  {
    name: "a",
    pageNumbers: Math.ceil(Math.random() * 1000),
  },
  {
    name: "b",
    pageNumbers: Math.ceil(Math.random() * 1000),
  },
  {
    name: "c",
    pageNumbers: Math.ceil(Math.random() * 1000),
  },
  {
    name: "d",
    pageNumbers: Math.ceil(Math.random() * 1000),
  },
];

export default function OptimisticUpdatePage() {
  const [isPending, startTransition] = useTransition();
  const [books, setBooks] = useState<Array<Book>>([newBooks[0]]);
  const [optimisticBooks, setOptimisticBooks] = useOptimistic(books);

  useEffect(() => {
    console.log(books, optimisticBooks);
  }, [books, optimisticBooks]);

  return (
    <div>
      <button
        onClick={() => {
          const newBook = newBooks.at(1);
          if (newBook)
            startTransition(async () => {
              setOptimisticBooks([...books, { name: newBook.name, pageNumbers: Math.ceil(Math.random() * 1000) }]);
              const booksWithAddedNewOne = await AddBooks(books, newBook!);
              setBooks(booksWithAddedNewOne);
            });
        }}
      >
        add
      </button>
      {optimisticBooks.map((book) => (
        <p key={book.pageNumbers}>
          {book.name} - {book.pageNumbers}
        </p>
      ))}
    </div>
  );
}

async function AddBooks(books: Array<Book>, book: Book): Promise<Array<Book>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...books, book]);
    }, 3000);
  });
}
