const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function PlannerBoard() {
  return (
    <div className="grid grid-cols-7 gap-4">
      {days.map((day) => (
        <div
          key={day}
          className="bg-slate-900 p-4 rounded-xl border border-slate-800"
        >
          <h3 className="font-bold mb-3">{day}</h3>

          <div className="text-sm text-slate-400">No content planned</div>
        </div>
      ))}
    </div>
  );
}
