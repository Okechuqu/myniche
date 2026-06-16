export default function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="text-center py-20 text-slate-400">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <p className="mt-2">{description}</p>
    </div>
  );
}
