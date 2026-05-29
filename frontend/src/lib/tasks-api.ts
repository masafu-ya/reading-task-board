import { apiGet, apiSend } from "@/lib/http";
import type { Task } from "@/types/task";

function toTask(data: unknown): Task {
  const item = data as Record<string, unknown>;
  return {
    id: Number(item.id),
    title: String(item.title),
    memo: item.memo != null ? String(item.memo) : null,
    done: Boolean(item.done),
    created_at:
      item.created_at != null ? String(item.created_at) : undefined,
  };
}

export async function fetchTasks(query?: string): Promise<Task[]> {
  const trimmed = query?.trim();
  const path =
    trimmed != null && trimmed.length > 0
      ? `/tasks?q=${encodeURIComponent(trimmed)}`
      : "/tasks";
  const data = await apiGet<unknown[]>(path, "タスク取得に失敗しました");
  if (!Array.isArray(data)) {
    throw new Error("タスク一覧の形式が不正です");
  }
  return data.map(toTask);
}

export async function createTask(title: string): Promise<Task> {
  const data = await apiSend<unknown>(
    "/tasks",
    "POST",
    "タスク追加に失敗しました",
    { title, done: false },
  );
  return toTask(data);
}

export async function updateTask(
  id: number,
  title: string,
  memo?: string | null,
): Promise<Task> {
  const data = await apiSend<unknown>(
    `/tasks/${id}`,
    "PUT",
    "タスク更新に失敗しました",
    { title, memo: memo ?? null },
  );
  return toTask(data);
}

export async function toggleTaskDone(id: number): Promise<Task> {
  const data = await apiSend<unknown>(
    `/tasks/${id}/done`,
    "PATCH",
    "完了状態の更新に失敗しました",
  );
  return toTask(data);
}

export async function deleteTask(id: number): Promise<void> {
  await apiSend<void>(
    `/tasks/${id}`,
    "DELETE",
    "タスク削除に失敗しました",
  );
}
