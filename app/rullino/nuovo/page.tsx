import Link from "next/link";
import { RullinoForm } from "@/components/rullino/RullinoForm";
import { createRullino } from "@/app/actions/rullino";

export default function NuovoRullinoPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-6 py-4">
        <span className="font-mono text-base font-semibold tracking-tight text-gray-900">
          Analog Archive
        </span>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-gray-700">
            Archivio
          </Link>
          <span>›</span>
          <span className="text-gray-700">Nuovo rullino</span>
        </nav>

        <h1 className="mb-8 text-2xl font-bold text-gray-900">Nuovo rullino</h1>

        <RullinoForm action={createRullino} cancelHref="/" />
      </div>
    </main>
  );
}
