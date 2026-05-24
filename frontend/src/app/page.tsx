export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
          Reading &amp; Task Board
        </h2>
        <p className="mt-4 text-lg text-zinc-600">学習用アプリ</p>
        <p className="mt-6 text-sm text-zinc-500">
          Day 1 完了 — Next.js の画面が表示できています。
        </p>
      </div>
    </div>
  );
}
