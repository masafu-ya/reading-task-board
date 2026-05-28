"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import Button from "@/components/ui/Button";
import ErrorAlert from "@/components/ui/ErrorAlert";
import PageHeader from "@/components/ui/PageHeader";
import { useBooks } from "@/hooks/useBooks";

export default function BookListPage() {
  const { books, loading, error, addBook, removeBook } = useBooks();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    setSubmitting(true);
    try {
      await addBook(trimmedTitle, author.trim() || undefined);
      setTitle("");
      setAuthor("");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number, bookTitle: string) {
    if (!window.confirm(`「${bookTitle}」を削除しますか？\nメモもすべて消えます。`)) {
      return;
    }
    await removeBook(id);
  }

  return (
    <div className="mx-auto w-full max-w-lg px-6 py-10">
      <PageHeader
        title="読書メモ"
        subtitle="Day 8 — 本を登録し、メモを複数付けられます"
      />

      {error && <ErrorAlert message={error} />}

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
                <Button
                  variant="danger-text"
                  onClick={() => void handleDelete(book.id, book.title)}
                >
                  削除
                </Button>
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
