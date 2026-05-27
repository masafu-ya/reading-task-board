"use client";

import { useCallback, useEffect, useState } from "react";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import { createTask, fetchTasks } from "@/lib/api";
import type { Task } from "@/types/task";

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    setError(null);
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "タスクの読み込みに失敗しました";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初回表示時に API からタスク一覧を取得
  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  async function handleAdd(title: string) {
    setError(null);
    try {
      await createTask(title);
      await loadTasks();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "タスクの追加に失敗しました";
      setError(message);
      throw err;
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg px-6 py-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">タスク一覧</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Day 4 — FastAPI と連携（メモリ API）
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
          <p className="mt-1 text-xs text-red-600">
            backend が起動しているか確認してください（uvicorn --port 8000）
          </p>
        </div>
      )}

      <section className="mb-8">
        {loading ? (
          <p className="rounded-lg border border-zinc-200 bg-white px-4 py-8 text-center text-sm text-zinc-500">
            読み込み中...
          </p>
        ) : (
          <TaskList tasks={tasks} />
        )}
      </section>

      <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
        <h3 className="mb-3 text-sm font-semibold text-zinc-700">
          タスクを追加
        </h3>
        <TaskForm onAdd={handleAdd} disabled={loading} />
      </section>
    </div>
  );
}
