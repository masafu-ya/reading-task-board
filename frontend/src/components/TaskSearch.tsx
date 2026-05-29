"use client";

type TaskSearchProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

/** タスク検索入力（SQL LIKE で API 検索） */
export default function TaskSearch({
  value,
  onChange,
  disabled = false,
}: TaskSearchProps) {
  return (
    <div className="mb-4">
      <label htmlFor="task-search" className="mb-1 block text-sm font-medium text-zinc-700">
        検索
      </label>
      <input
        id="task-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="タイトルやメモで検索..."
        disabled={disabled}
        className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm outline-none ring-blue-500 focus:border-blue-500 focus:ring-2 disabled:bg-zinc-100"
      />
    </div>
  );
}
