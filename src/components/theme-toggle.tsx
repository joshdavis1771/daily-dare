"use client";

import { Moon, Sun } from "lucide-react";
import { updateSettings } from "@/lib/settings-store";

export function ThemeToggle() {
  function toggleTheme() {
    const dark = !document.documentElement.classList.contains("dark");
    try { updateSettings({ theme: dark ? "dark" : "light" }); }
    catch { document.documentElement.classList.toggle("dark", dark); }
  }

  return <button type="button" onClick={toggleTheme} className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-neutral-600 transition-colors hover:bg-teal-50 hover:text-teal-700 dark:text-neutral-300 dark:hover:bg-teal-950 dark:hover:text-teal-300">
    <Moon size={20} className="dark:hidden" aria-hidden="true" />
    <Sun size={20} className="hidden dark:block" aria-hidden="true" />
    <span className="sr-only dark:hidden">Switch to dark mode</span>
    <span className="sr-only hidden dark:block">Switch to light mode</span>
  </button>;
}
