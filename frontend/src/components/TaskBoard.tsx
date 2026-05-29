"use client";

import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import TaskSearch from "@/components/TaskSearch";
import ErrorAlert from "@/components/ui/ErrorAlert";
import LoadingMessage from "@/components/ui/LoadingMessage";
import PageHeader from "@/components/ui/PageHeader";
import { useTasks } from "@/hooks/useTasks";

export default function TaskBoard() {
  const {
    tasks,
    searchQuery,
    setSearchQuery,
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
        subtitle="Day 9 — 検索機能（SQL LIKE）+ GitHub フロー"
      />

      {error && (
        <ErrorAlert
          message={error}
          hint="backend が起動しているか確認してください（uvicorn --port 8000）"
        />
      )}

      <TaskSearch
        value={searchQuery}
        onChange={setSearchQuery}
        disabled={loading}
      />

      <section className="mb-8">
        {loading ? (
          <LoadingMessage />
        ) : tasks.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500">
            {searchQuery.trim()
              ? "検索結果がありません"
              : "タスクがありません。下のフォームから追加してください。"}
          </p>
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
