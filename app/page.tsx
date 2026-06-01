import Link from "next/link";

export default function Home() {
  return (
    <main style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <h1>Book Tracker Frontend</h1>
      <p>This frontend connects to the FastAPI backend using NEXT_PUBLIC_API_URL.</p>

      <div style={{ marginTop: "20px" }}>
        <Link href="/books">Go to Books List</Link>
      </div>
    </main>
  );
}