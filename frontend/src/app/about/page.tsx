import PageHeader from "@/components/ui/PageHeader";

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-lg px-6 py-10">
      <PageHeader
        title="このアプリについて"
        subtitle="Reading & Task Board — 学習用プロジェクト"
      />
      <div className="space-y-4 text-sm leading-relaxed text-zinc-700">
        <p>
          このアプリは Cursor・Next.js・Python・MySQL・GitHub
          を学ぶための非公開プロジェクトです。
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>タスク … 日々のやることリスト</li>
          <li>読書メモ … 本ごとにメモを記録</li>
        </ul>
        <p className="text-zinc-500">
          10日間カリキュラムの Day 8 まで実装済みです。
        </p>
      </div>
    </div>
  );
}
