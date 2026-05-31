"use client";

import { useEffect, useState } from "react";

type Book = {
  id: number;
  title: string;
  author: string;
  status: string;
  rating: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("reading");
  const [rating, setRating] = useState(5);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchBooks() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/books`);

      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }

      const data = await response.json();
      setBooks(data);
    } catch {
      setError("Could not load books from the backend API.");
    } finally {
      setLoading(false);
    }
  }

  async function addBook(e: React.FormEvent) {
    e.preventDefault();

    try {
      setError("");

      const response = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          author,
          status,
          rating,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add book");
      }

      setTitle("");
      setAuthor("");
      setStatus("reading");
      setRating(5);
      fetchBooks();
    } catch {
      setError("Could not add the book.");
    }
  }

  async function loadBookDetails(bookId: number) {
    try {
      setError("");

      const response = await fetch(`${API_URL}/books/${bookId}`);

      if (!response.ok) {
        throw new Error("Failed to load book details");
      }

      const book = await response.json();

      setSelectedBook(book);
      setEditTitle(book.title);
      setEditAuthor(book.author);
      setEditStatus(book.status);
      setEditRating(book.rating);
    } catch {
      setError("Could not load book details.");
    }
  }

  async function updateBook(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedBook) return;

    try {
      setError("");

      const response = await fetch(`${API_URL}/books/${selectedBook.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle,
          author: editAuthor,
          status: editStatus,
          rating: editRating,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update book");
      }

      setSelectedBook(null);
      fetchBooks();
    } catch {
      setError("Could not update the book.");
    }
  }

  async function deleteBook(bookId: number) {
    try {
      setError("");

      const response = await fetch(`${API_URL}/books/${bookId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete book");
      }

      if (selectedBook?.id === bookId) {
        setSelectedBook(null);
      }

      fetchBooks();
    } catch {
      setError("Could not delete the book.");
    }
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 p-8 text-slate-900">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow">
        <h1 className="mb-2 text-3xl font-bold">Book Tracker Frontend</h1>
        <p className="mb-6 text-slate-600">
          This frontend connects to the FastAPI backend using NEXT_PUBLIC_API_URL.
        </p>

        <section className="mb-8 rounded-xl border p-4">
          <h2 className="mb-4 text-xl font-semibold">Add a New Book</h2>

          <form onSubmit={addBook} className="grid gap-4 md:grid-cols-5">
            <input
              className="rounded border p-2"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <input
              className="rounded border p-2"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />

            <select
              className="rounded border p-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="reading">reading</option>
              <option value="completed">completed</option>
              <option value="planned">planned</option>
            </select>

            <input
              className="rounded border p-2"
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            />

            <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Add Book
            </button>
          </form>
        </section>

        {loading && (
          <p className="mb-4 rounded bg-yellow-100 p-3 text-yellow-800">
            Loading books...
          </p>
        )}

        {error && (
          <p className="mb-4 rounded bg-red-100 p-3 text-red-800">{error}</p>
        )}

        <section className="mb-8 rounded-xl border p-4">
          <h2 className="mb-4 text-xl font-semibold">Books List</h2>

          {books.length === 0 && !loading ? (
            <p>No books found. Add one using the form above.</p>
          ) : (
            <div className="grid gap-3">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="flex flex-col justify-between gap-3 rounded border p-4 md:flex-row md:items-center"
                >
                  <div>
                    <h3 className="font-semibold">{book.title}</h3>
                    <p className="text-sm text-slate-600">
                      Author: {book.author} | Status: {book.status} | Rating:{" "}
                      {book.rating}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => loadBookDetails(book.id)}
                      className="rounded bg-slate-700 px-3 py-2 text-white hover:bg-slate-800"
                    >
                      View / Edit
                    </button>

                    <button
                      onClick={() => deleteBook(book.id)}
                      className="rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {selectedBook && (
          <section className="rounded-xl border p-4">
            <h2 className="mb-4 text-xl font-semibold">Book Detail / Update</h2>

            <p className="mb-4 text-sm text-slate-600">
              Editing book ID: {selectedBook.id}
            </p>

            <form onSubmit={updateBook} className="grid gap-4 md:grid-cols-5">
              <input
                className="rounded border p-2"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
              />

              <input
                className="rounded border p-2"
                value={editAuthor}
                onChange={(e) => setEditAuthor(e.target.value)}
                required
              />

              <select
                className="rounded border p-2"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              >
                <option value="reading">reading</option>
                <option value="completed">completed</option>
                <option value="planned">planned</option>
              </select>

              <input
                className="rounded border p-2"
                type="number"
                min="1"
                max="5"
                value={editRating}
                onChange={(e) => setEditRating(Number(e.target.value))}
              />

              <button className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                Update Book
              </button>
            </form>
          </section>
        )}
      </div>
    </main>
  );
}