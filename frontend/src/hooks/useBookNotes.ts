"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createBookNote,
  fetchBook,
  fetchBookNotes,
} from "@/lib/books-api";
import type { Book, BookNote } from "@/types";

/** 1冊の本とそのメモを管理するカスタムフック */
export function useBookNotes(bookId: number) {
  const [book, setBook] = useState<Book | null>(null);
  const [notes, setNotes] = useState<BookNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setError(null);
    try {
      const [bookData, notesData] = await Promise.all([
        fetchBook(bookId),
        fetchBookNotes(bookId),
      ]);
      setBook(bookData);
      setNotes(notesData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "データの読み込みに失敗しました",
      );
      setBook(null);
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  async function addNote(content: string) {
    setError(null);
    try {
      await createBookNote(bookId, content);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "メモ追加に失敗しました");
      throw err;
    }
  }

  return { book, notes, loading, error, addNote };
}
