import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import EmptyState from "@/components/ui/EmptyState";

describe("EmptyState", () => {
  it("メッセージを表示する", () => {
    render(<EmptyState message="タスクがありません" />);
    expect(screen.getByText("タスクがありません")).toBeInTheDocument();
  });
});
