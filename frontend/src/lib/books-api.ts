import { apiGet, apiSend } from "@/lib/http";
import type { Book, BookNote } from "@/types/book";

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
  const data = await apiGet<unknown[]>("/books", "本の一覧取得に失敗しました");
  if (!Array.isArray(data)) {
    throw new Error("本一覧の形式が不正です");
  }
  return data.map(toBook);
}

export async function fetchBook(id: number): Promise<Book> {
  const data = await apiGet<unknown>(
    `/books/${id}`,
    "本の取得に失敗しました",
  );
  return toBook(data);
}

export async function createBook(
  title: string,
  author?: string,
): Promise<Book> {
  const data = await apiSend<unknown>(
    "/books",
    "POST",
    "本の追加に失敗しました",
    { title, author: author || null },
  );
  return toBook(data);
}

export async function deleteBook(id: number): Promise<void> {
  await apiSend<void>(`/books/${id}`, "DELETE", "本の削除に失敗しました");
}

export async function fetchBookNotes(bookId: number): Promise<BookNote[]> {
  const data = await apiGet<unknown[]>(
    `/books/${bookId}/notes`,
    "メモ一覧取得に失敗しました",
  );
  if (!Array.isArray(data)) {
    throw new Error("メモ一覧の形式が不正です");
  }
  return data.map(toBookNote);
}

export async function createBookNote(
  bookId: number,
  content: string,
): Promise<BookNote> {
  const data = await apiSend<unknown>(
    `/books/${bookId}/notes`,
    "POST",
    "メモ追加に失敗しました",
    { content },
  );
  return toBookNote(data);
}
