"use client";

import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import TaskSearch from "@/components/TaskSearch";
import EmptyState from "@/components/ui/EmptyState";
import ErrorAlert from "@/components/ui/ErrorAlert";
import FormSection from "@/components/ui/FormSection";
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
        subtitle="日々のやること — 追加・完了・検索（ログイン必須）"
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
          <EmptyState
            message={
              searchQuery.trim()
                ? "検索結果がありません"
                : "タスクがありません。下のフォームから追加してください。"
            }
          />
        ) : (
          <TaskList
            tasks={tasks}
            onToggleDone={toggleDone}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        )}
      </section>

      <FormSection title="タスクを追加">
        <TaskForm onAdd={addTask} disabled={loading} />
      </FormSection>
    </div>
  );
}
