"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import ErrorAlert from "@/components/ui/ErrorAlert";
import FormSection from "@/components/ui/FormSection";
import { inputClassName } from "@/components/ui/inputStyles";
import LoadingMessage from "@/components/ui/LoadingMessage";
import PageHeader from "@/components/ui/PageHeader";
import { useBooks } from "@/hooks/useBooks";

export default function BookListPage() {
  const { books, loading, error, addBook, removeBook } = useBooks();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (submitting) return;

    if (!trimmedTitle) {
      setValidationError("本のタイトルを入力してください");
      return;
    }

    setValidationError(null);
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
        subtitle="本を登録し、読んだ内容をメモに残せます"
      />

      {error && <ErrorAlert message={error} />}

      <section className="mb-8">
        {loading ? (
          <LoadingMessage />
        ) : books.length === 0 ? (
          <EmptyState message="本がまだありません。下のフォームから追加してください。" />
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

      <FormSection title="本を追加">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (validationError) setValidationError(null);
            }}
            placeholder="本のタイトル"
            disabled={submitting}
            className={inputClassName}
          />
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="著者（任意）"
            disabled={submitting}
            className={inputClassName}
          />
          <Button type="submit" disabled={submitting}>
            {submitting ? "追加中..." : "追加"}
          </Button>
          {validationError && (
            <p className="text-sm text-red-600" role="alert">
              {validationError}
            </p>
          )}
        </form>
      </FormSection>
    </div>
  );
}
