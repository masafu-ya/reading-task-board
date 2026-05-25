import type { Task } from "@/types/task";

type TaskListProps = {
  tasks: Task[];
};

/** タスク一覧をカード形式で表示するコンポーネント */
export default function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500">
        タスクがありません。下のフォームから追加してください。
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm"
        >
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
              task.done
                ? "border-green-500 bg-green-500 text-white"
                : "border-zinc-300 bg-white text-transparent"
            }`}
            aria-hidden
          >
            ✓
          </span>
          <span
            className={`flex-1 text-sm ${
              task.done ? "text-zinc-400 line-through" : "text-zinc-800"
            }`}
          >
            {task.title}
          </span>
        </li>
      ))}
    </ul>
  );
}
