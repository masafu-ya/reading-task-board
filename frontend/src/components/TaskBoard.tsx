"use client";

import { useState } from "react";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import type { Task } from "@/types/task";

/** ダミーデータ（Day 2 は画面だけ。Day 4 以降で API に置き換え） */
const initialTasks: Task[] = [
  { id: 1, title: "Next.js のページを表示する", done: true },
  { id: 2, title: "タスク一覧コンポーネントを作る", done: false },
  { id: 3, title: "useState でタスクを追加する", done: false },
];

export default function TaskBoard() {
  // useState: 画面の状態（タスク配列）を保持。変更すると画面が再描画される
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  // 次に追加するタスクの id（既存の最大 id + 1）
  const [nextId, setNextId] = useState(4);

  function handleAdd(title: string) {
    const newTask: Task = { id: nextId, title, done: false };
    // スプレッド構文: 今の配列 [...tasks] に新しい1件を足す
    setTasks([...tasks, newTask]);
    setNextId(nextId + 1);
  }

  return (
    <div className="mx-auto w-full max-w-lg px-6 py-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">タスク一覧</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Day 2 — ダミーデータと useState（API 未接続）
        </p>
      </div>

      <section className="mb-8">
        <TaskList tasks={tasks} />
      </section>

      <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
        <h3 className="mb-3 text-sm font-semibold text-zinc-700">
          タスクを追加
        </h3>
        <TaskForm onAdd={handleAdd} />
      </section>
    </div>
  );
}
