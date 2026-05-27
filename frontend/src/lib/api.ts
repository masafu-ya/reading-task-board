import type { Task } from "@/types/task";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/** API から返るタスク JSON をフロント用の型に合わせる */
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

/** GET /tasks — タスク一覧を取得 */
export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(`${API_URL}/tasks`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`タスク取得に失敗しました (${res.status})`);
  }
  const data: unknown = await res.json();
  if (!Array.isArray(data)) {
    throw new Error("タスク一覧の形式が不正です");
  }
  return data.map(toTask);
}

/** POST /tasks — タスクを1件追加 */
export async function createTask(title: string): Promise<Task> {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, done: false }),
  });
  if (!res.ok) {
    throw new Error(`タスク追加に失敗しました (${res.status})`);
  }
  const data: unknown = await res.json();
  return toTask(data);
}
