import PageHeader from "@/components/ui/PageHeader";

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-lg px-6 py-10">
      <PageHeader
        title="このアプリについて"
        subtitle="Reading & Task Board — v0.1.0"
      />
      <div className="space-y-4 text-sm leading-relaxed text-zinc-700">
        <p>
          このアプリは Cursor・Next.js・Python・MySQL・GitHub
          を学ぶための非公開プロジェクトです。10日間カリキュラムの成果物として完成しました。
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>タスク … 追加・編集・削除・完了・検索</li>
          <li>読書メモ … 本の登録とメモの記録</li>
        </ul>
        <p className="text-zinc-500">
          振り返りはリポジトリ直下の <code className="text-zinc-700">REFLECTION.md</code>{" "}
          を参照してください。
        </p>
      </div>
    </div>
  );
}
