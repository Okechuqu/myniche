interface Props {
  title: string;
  value: string;
}

export default function StatCard({ title, value }: Props) {
  return (
    <div
      className="
      bg-slate-900
      rounded-xl
      p-6
      border
      border-slate-800
      "
    >
      <h3 className="text-slate-400">{title}</h3>

      <p
        className="
        text-3xl
        font-bold
        mt-2
        "
      >
        {value}
      </p>
    </div>
  );
}
