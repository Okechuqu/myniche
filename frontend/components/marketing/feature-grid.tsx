export default function FeatureGrid() {
  const features = [
    {
      title: "AI Script Generator",
      description: "Generate niche-specific content scripts instantly.",
    },
    {
      title: "Content Planner",
      description: "Weekly and monthly planning system.",
    },
    {
      title: "Creator Toolkit",
      description: "Curated creator software recommendations.",
    },
    {
      title: "Idea Vault",
      description: "Store and organize content ideas.",
    },
    {
      title: "Content Calendar",
      description: "Schedule and track content production.",
    },
    {
      title: "Analytics",
      description: "Track consistency and publishing habits.",
    },
  ];

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-4xl font-bold">
          Everything Creators Need
        </h2>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <h3 className="text-xl font-semibold">{feature.title}</h3>

              <p className="mt-3 text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
