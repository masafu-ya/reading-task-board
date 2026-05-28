type LoadingMessageProps = {
  message?: string;
};

export default function LoadingMessage({
  message = "読み込み中...",
}: LoadingMessageProps) {
  return (
    <p className="rounded-lg border border-zinc-200 bg-white px-4 py-8 text-center text-sm text-zinc-500">
      {message}
    </p>
  );
}
