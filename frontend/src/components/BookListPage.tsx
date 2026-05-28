"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { createBook, deleteBook, fetchBooks } from "@/lib/books-api";
import type { Book } from "@/types/book";

export default function BookListPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBooks = useCallback(async () => {
    setError(null);
    try {
      setBooks(await fetchBooks());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "本の読み込みに失敗しました",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBooks();
  }, [loadBooks]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    setSubmitting(true);
    setError(null);
    try {
      await createBook(trimmedTitle, author.trim() || undefined);
      setTitle("");
      setAuthor("");
      await loadBooks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "本の追加に失敗しました");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number, bookTitle: string) {
    if (!window.confirm(`「${bookTitle}」を削除しますか？\nメモもすべて消えます。`)) {
      return;
    }
    setError(null);
    try {
      await deleteBook(id);
      await loadBooks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "本の削除に失敗しました");
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg px-6 py-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">読書メモ</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Day 7 — 本を登録し、メモを複数付けられます
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="mb-8">
        {loading ? (
          <p className="text-center text-sm text-zinc-500">読み込み中...</p>
        ) : books.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500">
            本がまだありません。下のフォームから追加してください。
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {books.map((book) => (
              <li
                key={book.id}
                className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm"
              >
                <div className="flex-1">
                  <Link
                    href={`/books/${book.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {book.title}
                  </Link>
                  {book.author && (
                    <p className="text-xs text-zinc-500">{book.author}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => void handleDelete(book.id, book.title)}
                  className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
        <h3 className="mb-3 text-sm font-semibold text-zinc-700">本を追加</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="本のタイトル"
            disabled={submitting}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none ring-blue-500 focus:border-blue-500 focus:ring-2"
          />
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="著者（任意）"
            disabled={submitting}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none ring-blue-500 focus:border-blue-500 focus:ring-2"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "追加中..." : "追加"}
          </button>
        </form>
      </section>
    </div>
  );
}
