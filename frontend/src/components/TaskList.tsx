"use client";

import { useState } from "react";
import type { Task } from "@/types/task";

type TaskListProps = {
  tasks: Task[];
  onToggleDone: (id: number) => Promise<void>;
  onUpdate: (id: number, title: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

/** タスク一覧（編集・削除・完了ボタン付き） */
export default function TaskList({
  tasks,
  onToggleDone,
  onUpdate,
  onDelete,
}: TaskListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  if (tasks.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500">
        タスクがありません。下のフォームから追加してください。
      </p>
    );
  }

  function startEdit(task: Task) {
    setEditingId(task.id);
    setEditTitle(task.title);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle("");
  }

  async function saveEdit(id: number) {
    const trimmed = editTitle.trim();
    if (!trimmed) return;
    setBusyId(id);
    try {
      await onUpdate(id, trimmed);
      cancelEdit();
    } finally {
      setBusyId(null);
    }
  }

  async function handleToggle(id: number) {
    setBusyId(id);
    try {
      await onToggleDone(id);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: number, title: string) {
    if (!window.confirm(`「${title}」を削除しますか？`)) return;
    setBusyId(id);
    try {
      await onDelete(id);
      if (editingId === id) cancelEdit();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <ul className="flex flex-col gap-3">
      {tasks.map((task) => {
        const isEditing = editingId === task.id;
        const isBusy = busyId === task.id;

        return (
          <li
            key={task.id}
            className="rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm"
          >
            {isEditing ? (
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  disabled={isBusy}
                  className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:border-blue-500 focus:ring-2"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => void saveEdit(task.id)}
                    disabled={isBusy}
                    className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    保存
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    disabled={isBusy}
                    className="rounded-lg border border-zinc-300 px-3 py-2 text-xs text-zinc-600 hover:bg-zinc-50 disabled:opacity-50"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => void handleToggle(task.id)}
                  disabled={isBusy}
                  aria-label={task.done ? "未完了に戻す" : "完了にする"}
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs disabled:opacity-50 ${
                    task.done
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-zinc-300 bg-white text-transparent hover:border-green-400"
                  }`}
                >
                  ✓
                </button>
                <span
                  className={`flex-1 text-sm ${
                    task.done ? "text-zinc-400 line-through" : "text-zinc-800"
                  }`}
                >
                  {task.title}
                </span>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(task)}
                    disabled={isBusy}
                    className="rounded px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                  >
                    編集
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(task.id, task.title)}
                    disabled={isBusy}
                    className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    削除
                  </button>
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
