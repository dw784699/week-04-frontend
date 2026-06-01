"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Book = {
  id: number;
  title: string;
  author: string;
  status: string;
  rating: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [book, setBook] = useState<Book | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("reading");
  const [rating, setRating] = useState(5);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function fetchBook() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/books/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch book.");
      }

      const data = await response.json();

      setBook(data);
      setTitle(data.title);
      setAuthor(data.author);
      setStatus(data.status);
      setRating(data.rating);
    } catch (err) {
      setError("Error loading book detail. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  async function updateBook(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const response = await fetch(`${API_URL}/books/${id}`, {
        method: "PUT",
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
        throw new Error("Failed to update book.");
      }

      await fetchBook();
    } catch (err) {
      setError("Error updating book.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteBook() {
    const confirmDelete = window.confirm("Are you sure you want to delete this book?");

    if (!confirmDelete) return;

    try {
      setError("");

      const response = await fetch(`${API_URL}/books/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete book.");
      }

      router.push("/books");
    } catch (err) {
      setError("Error deleting book.");
    }
  }

  useEffect(() => {
    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <main style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
        <p>Loading book detail...</p>
      </main>
    );
  }

  if (error && !book) {
    return (
      <main style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
        <p style={{ color: "red" }}>{error}</p>
        <Link href="/books">Back to Books List</Link>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <h1>Book Detail / Update</h1>

      <p>
        <Link href="/books">Back to Books List</Link>
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {book && (
        <div style={{ border: "1px solid #ccc", padding: "20px" }}>
          <h2>{book.title}</h2>
          <p>Author: {book.author}</p>
          <p>Status: {book.status}</p>
          <p>Rating: {book.rating}</p>
        </div>
      )}

      <h2>Edit Book</h2>

      <form
        onSubmit={updateBook}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          border: "1px solid #ccc",
          padding: "20px",
          marginTop: "20px",
        }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />

        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Author"
          required
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="reading">reading</option>
          <option value="completed">completed</option>
          <option value="planned">planned</option>
        </select>

        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          min="1"
          max="5"
        />

        <button type="submit" disabled={saving}>
          {saving ? "Updating..." : "Update Book"}
        </button>
      </form>

      <button
        onClick={deleteBook}
        style={{
          marginTop: "20px",
          backgroundColor: "red",
          color: "white",
          padding: "10px",
        }}
      >
        Delete Book
      </button>
    </main>
  );
}