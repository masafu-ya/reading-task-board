"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import ErrorAlert from "@/components/ui/ErrorAlert";
import LoadingMessage from "@/components/ui/LoadingMessage";
import { useBookNotes } from "@/hooks/useBookNotes";

type BookDetailPageProps = {
  bookId: number;
};

export default function BookDetailPage({ bookId }: BookDetailPageProps) {
  const { book, notes, loading, error, addNote } = useBookNotes(bookId);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;

    setSubmitting(true);
    try {
      await addNote(trimmed);
      setContent("");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="px-6 py-10">
        <LoadingMessage />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="px-6 py-10 text-center">
        <p className="text-sm text-red-600">本が見つかりません</p>
        <Link href="/books" className="mt-4 inline-block text-sm text-blue-600">
          ← 一覧に戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg px-6 py-10">
      <Link href="/books" className="text-sm text-blue-600 hover:underline">
        ← 読書メモ一覧
      </Link>

      <div className="mb-8 mt-4">
        <h2 className="text-2xl font-bold text-zinc-900">{book.title}</h2>
        {book.author && (
          <p className="mt-1 text-sm text-zinc-500">著者: {book.author}</p>
        )}
      </div>

      {error && <ErrorAlert message={error} />}

      <section className="mb-8">
        <h3 className="mb-3 text-sm font-semibold text-zinc-700">メモ一覧</h3>
        {notes.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500">
            メモがありません。下のフォームから追加してください。
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {notes.map((note) => (
              <li
                key={note.id}
                className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800 shadow-sm"
              >
                {note.content}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
        <h3 className="mb-3 text-sm font-semibold text-zinc-700">メモを追加</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="読書メモを入力..."
            rows={3}
            disabled={submitting}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none ring-blue-500 focus:border-blue-500 focus:ring-2"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "追加中..." : "メモを追加"}
          </button>
        </form>
      </section>
    </div>
  );
}
