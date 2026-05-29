import type { ReactNode } from "react";

type FormSectionProps = {
  title: string;
  children: ReactNode;
};

/** フォームを包む共通セクション */
export default function FormSection({ title, children }: FormSectionProps) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      <h3 className="mb-3 text-sm font-semibold text-zinc-700">{title}</h3>
      {children}
    </section>
  );
}
