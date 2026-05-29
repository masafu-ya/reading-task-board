"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import ErrorAlert from "@/components/ui/ErrorAlert";
import FormSection from "@/components/ui/FormSection";
import { textareaClassName } from "@/components/ui/inputStyles";
import LoadingMessage from "@/components/ui/LoadingMessage";
import PageHeader from "@/components/ui/PageHeader";
import { useBookNotes } from "@/hooks/useBookNotes";

type BookDetailPageProps = {
  bookId: number;
};

export default function BookDetailPage({ bookId }: BookDetailPageProps) {
  const { book, notes, loading, error, addNote } = useBookNotes(bookId);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = content.trim();
    if (submitting) return;

    if (!trimmed) {
      setValidationError("メモを入力してください");
      return;
    }

    setValidationError(null);
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
      <div className="mx-auto w-full max-w-lg px-6 py-10">
        <LoadingMessage />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="mx-auto w-full max-w-lg px-6 py-10 text-center">
        <EmptyState message="本が見つかりません" />
        <Link
          href="/books"
          className="mt-4 inline-block text-sm text-blue-600 hover:underline"
        >
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
        <PageHeader
          title={book.title}
          subtitle={book.author ? `著者: ${book.author}` : "読書メモ"}
        />
      </div>

      {error && <ErrorAlert message={error} />}

      <section className="mb-8">
        <h3 className="mb-3 text-sm font-semibold text-zinc-700">メモ一覧</h3>
        {notes.length === 0 ? (
          <EmptyState message="メモがありません。下のフォームから追加してください。" />
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

      <FormSection title="メモを追加">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (validationError) setValidationError(null);
            }}
            placeholder="読書メモを入力..."
            rows={3}
            disabled={submitting}
            className={textareaClassName}
          />
          <Button type="submit" disabled={submitting}>
            {submitting ? "追加中..." : "メモを追加"}
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
