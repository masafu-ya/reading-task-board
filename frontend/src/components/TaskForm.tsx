"use client";

import { FormEvent, useState } from "react";
import Button from "@/components/ui/Button";
import { inputClassName } from "@/components/ui/inputStyles";

type TaskFormProps = {
  onAdd: (title: string) => Promise<void>;
  disabled?: boolean;
};

/** タスクを入力して API に追加するフォーム */
export default function TaskForm({ onAdd, disabled = false }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = title.trim();
    if (submitting || disabled) return;

    if (!trimmed) {
      setValidationError("タイトルを入力してください");
      return;
    }

    setValidationError(null);
    setSubmitting(true);
    try {
      await onAdd(trimmed);
      setTitle("");
    } finally {
      setSubmitting(false);
    }
  }

  const isDisabled = disabled || submitting;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (validationError) setValidationError(null);
          }}
          placeholder="新しいタスクを入力..."
          disabled={isDisabled}
          className={`flex-1 ${inputClassName}`}
        />
        <Button type="submit" disabled={isDisabled}>
          {submitting ? "追加中..." : "追加"}
        </Button>
      </div>
      {validationError && (
        <p className="text-sm text-red-600" role="alert">
          {validationError}
        </p>
      )}
    </form>
  );
}
