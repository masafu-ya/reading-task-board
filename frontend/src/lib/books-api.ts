import type { Book, BookNote } from "@/types/book";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function toBook(data: unknown): Book {
  const item = data as Record<string, unknown>;
  return {
    id: Number(item.id),
    title: String(item.title),
    author: item.author != null ? String(item.author) : null,
    created_at:
      item.created_at != null ? String(item.created_at) : undefined,
  };
}

function toBookNote(data: unknown): BookNote {
  const item = data as Record<string, unknown>;
  return {
    id: Number(item.id),
    book_id: Number(item.book_id),
    content: String(item.content),
    created_at:
      item.created_at != null ? String(item.created_at) : undefined,
  };
}

export async function fetchBooks(): Promise<Book[]> {
  const res = await fetch(`${API_URL}/books`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`本の一覧取得に失敗しました (${res.status})`);
  }
  const data: unknown = await res.json();
  if (!Array.isArray(data)) {
    throw new Error("本一覧の形式が不正です");
  }
  return data.map(toBook);
}

export async function fetchBook(id: number): Promise<Book> {
  const res = await fetch(`${API_URL}/books/${id}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`本の取得に失敗しました (${res.status})`);
  }
  const data: unknown = await res.json();
  return toBook(data);
}

export async function createBook(
  title: string,
  author?: string,
): Promise<Book> {
  const res = await fetch(`${API_URL}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, author: author || null }),
  });
  if (!res.ok) {
    throw new Error(`本の追加に失敗しました (${res.status})`);
  }
  const data: unknown = await res.json();
  return toBook(data);
}

export async function deleteBook(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/books/${id}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error(`本の削除に失敗しました (${res.status})`);
  }
}

export async function fetchBookNotes(bookId: number): Promise<BookNote[]> {
  const res = await fetch(`${API_URL}/books/${bookId}/notes`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`メモ一覧取得に失敗しました (${res.status})`);
  }
  const data: unknown = await res.json();
  if (!Array.isArray(data)) {
    throw new Error("メモ一覧の形式が不正です");
  }
  return data.map(toBookNote);
}

export async function createBookNote(
  bookId: number,
  content: string,
): Promise<BookNote> {
  const res = await fetch(`${API_URL}/books/${bookId}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) {
    throw new Error(`メモ追加に失敗しました (${res.status})`);
  }
  const data: unknown = await res.json();
  return toBookNote(data);
}
