"use client";

import { useCallback, useEffect, useState } from "react";
import { createBook, deleteBook, fetchBooks } from "@/lib/books-api";
import type { Book } from "@/types";

/** 本一覧の取得・追加・削除をまとめたカスタムフック */
export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
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
    void reload();
  }, [reload]);

  async function addBook(title: string, author?: string) {
    setError(null);
    try {
      await createBook(title, author);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "本の追加に失敗しました");
      throw err;
    }
  }

  async function removeBook(id: number) {
    setError(null);
    try {
      await deleteBook(id);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "本の削除に失敗しました");
      throw err;
    }
  }

  return { books, loading, error, addBook, removeBook };
}
