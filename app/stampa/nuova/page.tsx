import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { NuovaStampaWizard } from "@/components/stampa/NuovaStampaWizard";
import { getRulliniConNegativi } from "@/lib/queries/rullini";

export default async function NuovaStampaDaHomePage() {
  const rullini = await getRulliniConNegativi();

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <AppHeader />

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
          <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200">
            Archivio
          </Link>
          <span>›</span>
          <span className="text-gray-700 dark:text-gray-300">Nuova stampa</span>
        </nav>

        <h1 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
          Nuova sessione di stampa
        </h1>

        <NuovaStampaWizard rullini={rullini} />
      </div>
    </main>
  );
}
