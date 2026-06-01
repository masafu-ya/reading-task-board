import { cleanup, render, screen, fireEvent, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import TaskForm from "@/components/TaskForm";

describe("TaskForm", () => {
  afterEach(() => {
    cleanup();
  });
  it("空タイトルでバリデーションエラーを表示する", async () => {
    const onAdd = vi.fn();
    render(<TaskForm onAdd={onAdd} />);

    fireEvent.click(screen.getByRole("button", { name: "追加" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "タイトルを入力してください",
    );
    expect(onAdd).not.toHaveBeenCalled();
  });

  it("タイトル入力後に onAdd を呼ぶ", async () => {
    const onAdd = vi.fn().mockResolvedValue(undefined);
    render(<TaskForm onAdd={onAdd} />);

    fireEvent.change(screen.getByPlaceholderText("新しいタスクを入力..."), {
      target: { value: "テストタスク" },
    });
    fireEvent.click(screen.getByRole("button", { name: "追加" }));

    await waitFor(() => {
      expect(onAdd).toHaveBeenCalledWith("テストタスク");
    });
  });
});
