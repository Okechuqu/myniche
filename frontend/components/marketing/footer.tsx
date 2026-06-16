import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:justify-between">
        <div>
          <h3 className="text-xl font-bold">MyNiche</h3>
          <p className="mt-2 text-slate-400">The creator operating system.</p>
        </div>

        <div className="flex gap-8">
          <Link href="/features">Features</Link>
          <Link href="/tools">Tools</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/resources">Resources</Link>
        </div>
      </div>
    </footer>
  );
}
