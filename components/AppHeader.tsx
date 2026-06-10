"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";

export function AppHeader() {
  const { theme, toggle } = useTheme();

  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-6 py-4 flex items-center justify-between">
      <Link
        href="/"
        className="font-mono text-base font-semibold tracking-tight text-gray-900 dark:text-white hover:opacity-70 transition-opacity"
      >
        Analog Archive
      </Link>
      <button
        type="button"
        onClick={toggle}
        aria-label={theme === "dark" ? "Passa alla modalità chiara" : "Passa alla modalità scura"}
        className="rounded-lg border border-gray-200 dark:border-gray-700 p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
      >
        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      </button>
    </header>
  );
}

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
