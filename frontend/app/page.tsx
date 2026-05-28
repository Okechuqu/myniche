import NicheForm from "@/components/NicheForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-extrabold text-center text-white mb-8 tracking-tight">
          Creator Suite <span className="text-indigo-500"></span>
        </h1>
        <NicheForm />
      </div>
    </main>
  );
}
