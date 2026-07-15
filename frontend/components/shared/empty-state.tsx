export default function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="theme-muted py-20 text-center">
      <h2 className="text-xl font-bold text-[var(--foreground)]">{title}</h2>
      <p className="mt-2">{description}</p>
    </div>
  );
}
