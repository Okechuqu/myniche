export default function AnalyticsCards() {
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <p className="text-sm text-slate-400">Total Scripts</p>
        <h2 className="mt-2 text-2xl font-bold">24</h2>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <p className="text-sm text-slate-400">Weekly Output</p>
        <h2 className="mt-2 text-2xl font-bold">12</h2>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <p className="text-sm text-slate-400">Consistency Score</p>
        <h2 className="mt-2 text-2xl font-bold">82%</h2>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <p className="text-sm text-slate-400">Streak</p>
        <h2 className="mt-2 text-2xl font-bold">7 days</h2>
      </div>
    </div>
  );
}
