"use client";

import { FormEvent, useState } from "react";

type TaskFormProps = {
  onAdd: (title: string) => void;
};

/** タスクを入力して追加するフォーム（まだ API には送らない） */
export default function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setTitle("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="新しいタスクを入力..."
        className="flex-1 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 outline-none ring-blue-500 focus:border-blue-500 focus:ring-2"
      />
      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        追加
      </button>
    </form>
  );
}
