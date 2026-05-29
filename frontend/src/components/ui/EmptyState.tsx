type EmptyStateProps = {
  message: string;
};

/** データ 0 件時の共通表示 */
export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <p className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500">
      {message}
    </p>
  );
}
