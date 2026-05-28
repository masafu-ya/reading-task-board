import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger-text";
};

const styles = {
  primary:
    "rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50",
  secondary:
    "rounded-lg border border-zinc-300 px-3 py-2 text-xs text-zinc-600 hover:bg-zinc-50 disabled:opacity-50",
  "danger-text":
    "rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50",
};

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`${styles[variant]} ${className}`.trim()}
      {...props}
    />
  );
}
