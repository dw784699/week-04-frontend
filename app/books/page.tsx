"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Book = {
  id: number;
  title: string;
  author: string;
  status: string;
  rating: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchBooks() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/books`);

      if (!response.ok) {
        throw new Error("Failed to fetch books.");
      }

      const data = await response.json();
      setBooks(data);
    } catch (err) {
      setError("Error loading books. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <main style={{ maxWidth: "900px", margin: "40px auto", padding: "20px" }}>
      <h1>Books List</h1>

      <p>
        <Link href="/">Home</Link> | <Link href="/books/new">Add New Book</Link>
      </p>

      {loading && <p>Loading books...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && books.length === 0 && <p>No books found.</p>}

      {!loading && !error && books.length > 0 && (
        <div style={{ border: "1px solid #ccc", padding: "15px" }}>
          {books.map((book) => (
            <div
              key={book.id}
              style={{
                borderBottom: "1px solid #ddd",
                padding: "12px 0",
              }}
            >
              <h3>{book.title}</h3>
              <p>
                Author: {book.author} | Status: {book.status} | Rating:{" "}
                {book.rating}
              </p>
              <Link href={`/books/${book.id}`}>View Detail / Edit</Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}