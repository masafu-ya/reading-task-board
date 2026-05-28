"use client";

import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import ErrorAlert from "@/components/ui/ErrorAlert";
import LoadingMessage from "@/components/ui/LoadingMessage";
import PageHeader from "@/components/ui/PageHeader";
import { useTasks } from "@/hooks/useTasks";

export default function TaskBoard() {
  const {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    toggleDone,
    deleteTask,
  } = useTasks();

  return (
    <div className="mx-auto w-full max-w-lg px-6 py-10">
      <PageHeader
        title="タスク一覧"
        subtitle="Day 8 — hooks とコンポーネント整理"
      />

      {error && (
        <ErrorAlert
          message={error}
          hint="backend が起動しているか確認してください（uvicorn --port 8000）"
        />
      )}

      <section className="mb-8">
        {loading ? (
          <LoadingMessage />
        ) : (
          <TaskList
            tasks={tasks}
            onToggleDone={toggleDone}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        )}
      </section>

      <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
        <h3 className="mb-3 text-sm font-semibold text-zinc-700">
          タスクを追加
        </h3>
        <TaskForm onAdd={addTask} disabled={loading} />
      </section>
    </div>
  );
}
