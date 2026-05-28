type PageHeaderProps = {
  title: string;
  subtitle: string;
};

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-zinc-900">{title}</h2>
      <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
    </div>
  );
}
