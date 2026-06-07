"use client";

import { useState } from "react";

type Role = "user" | "assistant";

type Message = {
  role: Role;
  content: string;
};

type ChatMode = "general" | "recommendations";

export default function ChatPage() {
  const [mode, setMode] = useState<ChatMode>("general");
  const [input, setInput] = useState("");
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  async function handleSendMessage() {
    const trimmedMessage = input.trim();

    if (!trimmedMessage) {
      setError("Please enter a message first.");
      return;
    }

    setError("");
    setIsLoading(true);

    const userMessage: Message = {
      role: "user",
      content: trimmedMessage,
    };

    const updatedHistory = [...conversationHistory, userMessage];
    setConversationHistory(updatedHistory);
    setInput("");

    const endpoint = mode === "general" ? "/ai/chat" : "/ai/recommend";

    try {
      const response = await fetch(`${apiBaseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedMessage,
          conversation_history: conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply || "No reply returned from the assistant.",
      };

      if (Array.isArray(data.updated_history)) {
        setConversationHistory(data.updated_history);
      } else {
        setConversationHistory([...updatedHistory, assistantMessage]);
      }
    } catch {
      setConversationHistory(updatedHistory);
      setError(
        "Something went wrong. Make sure the backend is running on http://localhost:8000."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleClearChat() {
    setConversationHistory([]);
    setInput("");
    setError("");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <section className="mb-8 rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
            Week 5 AI Chat
          </p>

          <h1 className="mb-4 text-4xl font-bold">
            Book Tracker AI Assistant
          </h1>

          <p className="max-w-2xl text-slate-300">
            This page connects the frontend to the FastAPI backend. It supports
            a general chat mode and a personalized recommendation mode.
          </p>
        </section>

        <section className="mb-6 rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="mb-4 text-2xl font-semibold">Choose Chat Mode</h2>

          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => setMode("general")}
              className={`rounded-xl px-5 py-3 font-semibold transition ${
                mode === "general"
                  ? "bg-cyan-400 text-slate-950"
                  : "bg-slate-800 text-white hover:bg-slate-700"
              }`}
            >
              General Chat
            </button>

            <button
              type="button"
              onClick={() => setMode("recommendations")}
              className={`rounded-xl px-5 py-3 font-semibold transition ${
                mode === "recommendations"
                  ? "bg-emerald-400 text-slate-950"
                  : "bg-slate-800 text-white hover:bg-slate-700"
              }`}
            >
              Recommendations
            </button>
          </div>

          <p className="mt-4 text-sm text-slate-400">
            Current mode:{" "}
            <span className="font-semibold text-white">
              {mode === "general" ? "General Chat" : "Recommendations"}
            </span>
          </p>
        </section>

        <section className="mb-6 rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="mb-4 text-2xl font-semibold">Conversation</h2>

          <div className="mb-6 min-h-64 rounded-xl border border-slate-700 bg-slate-950 p-4">
            {conversationHistory.length === 0 ? (
              <p className="text-slate-400">
                No messages yet. Ask the assistant about a book or request a
                recommendation.
              </p>
            ) : (
              <div className="space-y-4">
                {conversationHistory.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`rounded-xl p-4 ${
                      message.role === "user" ? "bg-cyan-950" : "bg-slate-800"
                    }`}
                  >
                    <p className="mb-2 text-sm font-bold uppercase tracking-wide text-cyan-300">
                      {message.role === "user" ? "User" : "Assistant"}
                    </p>
                    <p className="whitespace-pre-wrap leading-7 text-slate-100">
                      {message.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={
                mode === "general"
                  ? "Example: What is Atomic Habits about?"
                  : "Example: Based on my current book list, what should I read next?"
              }
              className="h-32 w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-cyan-400"
            />

            {error && (
              <p className="rounded-xl border border-red-500 bg-red-950 p-3 text-red-200">
                {error}
              </p>
            )}

            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={isLoading}
                className="rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Sending..." : "Send Message"}
              </button>

              <button
                type="button"
                onClick={handleClearChat}
                className="rounded-xl bg-slate-700 px-6 py-3 font-bold text-white transition hover:bg-slate-600"
              >
                Clear Conversation
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6 text-slate-300">
          <h2 className="mb-3 text-xl font-semibold text-white">
            What this page demonstrates
          </h2>

          <ul className="list-disc space-y-2 pl-6">
            <li>
              Frontend chat UI at <code>/chat</code>.
            </li>
            <li>Conversation history displayed on the page.</li>
            <li>
              General mode calls <code>/ai/chat</code>.
            </li>
            <li>
              Recommendations mode calls <code>/ai/recommend</code>.
            </li>
            <li>
              Frontend connects to the FastAPI backend through{" "}
              <code>NEXT_PUBLIC_API_URL</code>.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}