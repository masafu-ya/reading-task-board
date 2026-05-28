"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createTask,
  deleteTask,
  fetchTasks,
  toggleTaskDone,
  updateTask,
} from "@/lib/tasks-api";
import type { Task } from "@/types";

/** タスク一覧の取得・追加・更新・削除をまとめたカスタムフック */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setError(null);
    try {
      setTasks(await fetchTasks());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "タスクの読み込みに失敗しました",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  async function runAction(action: () => Promise<void>, fallback: string) {
    setError(null);
    try {
      await action();
      await reload();
    } catch (err) {
      const message = err instanceof Error ? err.message : fallback;
      setError(message);
      throw err;
    }
  }

  return {
    tasks,
    loading,
    error,
    addTask: (title: string) =>
      runAction(() => createTask(title).then(() => {}), "タスクの追加に失敗しました"),
    updateTask: (id: number, title: string) =>
      runAction(
        () => updateTask(id, title).then(() => {}),
        "タスクの更新に失敗しました",
      ),
    toggleDone: (id: number) =>
      runAction(
        () => toggleTaskDone(id).then(() => {}),
        "完了状態の更新に失敗しました",
      ),
    deleteTask: (id: number) =>
      runAction(() => deleteTask(id), "タスクの削除に失敗しました"),
  };
}
