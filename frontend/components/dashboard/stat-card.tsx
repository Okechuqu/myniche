interface Props {
  title: string;
  value: string;
}

export default function StatCard({ title, value }: Props) {
  return (
    <div
      className="
      theme-surface
      rounded-xl
      p-6
      border
      "
    >
      <h3 className="theme-muted">{title}</h3>

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
