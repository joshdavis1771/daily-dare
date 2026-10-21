"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bell, ChevronRight, Eye, Gauge, Globe2, Lock, Moon, Play, Shield, Sun, Trash2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { updateSettings, useSettings, type SettingsState } from "@/lib/settings-store";

import { BlockedAccounts } from "@/components/safety-controls";

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${checked ? "bg-teal-700" : "bg-neutral-200 dark:bg-neutral-700"}`}><span className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ease-out ${checked ? "translate-x-5" : "translate-x-0"}`} /></button>;
}

function SettingRow({ icon: Icon, title, description, children }: { icon: typeof Bell; title: string; description: string; children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-4 border-b border-neutral-200 py-5 last:border-b-0 dark:border-neutral-700"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300"><Icon size={18} /></span><span className="min-w-0 flex-1"><strong className="block text-sm">{title}</strong><span className="mt-1 block text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">{description}</span></span><span className="ml-auto max-w-full shrink-0">{children}</span></div>;
}

export default function SettingsPage() {
  const settings = useSettings();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  function update(change: Partial<SettingsState>) {
    try {
      updateSettings(change);
      setError("");
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1200);
    } catch {
      setSaved(false);
      setError("Your settings could not be saved. Check that browser storage is available and try again.");
    }
  }
  return <AppShell><main className="mx-auto max-w-2xl px-5 pb-32 pt-10 lg:px-10">
    <Link href="/profile" className="inline-flex items-center gap-1 text-sm font-semibold text-teal-700 dark:text-teal-300"><ArrowLeft size={16} /> Back to profile</Link>
    <div className="mt-8 flex items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300">Your controls</p><h1 className="mt-2 text-4xl font-black tracking-tight">Settings</h1></div>{saved && <p role="status" className="text-xs font-semibold text-teal-700 dark:text-teal-300">Saved</p>}</div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">{error}</p>}
    <section className="mt-8"><h2 className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">Notifications</h2><div className="rounded-2xl border border-neutral-200 bg-white px-5 dark:border-neutral-700 dark:bg-neutral-800"><SettingRow icon={Bell} title="Daily dare reminders" description="Choose whether Daily Dare can remind you when your dare drops."><Toggle checked={settings.notifications} onChange={notifications => update({ notifications })} label="Daily dare reminders" /></SettingRow></div></section>
    <section className="mt-8"><h2 className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">Privacy</h2><div className="rounded-2xl border border-neutral-200 bg-white px-5 dark:border-neutral-700 dark:bg-neutral-800"><SettingRow icon={Lock} title="Private account" description="Only approved followers can see your posts. Available when live account privacy is connected."><Toggle checked={settings.privateAccount} onChange={privateAccount => update({ privateAccount })} label="Private account" /></SettingRow><SettingRow icon={Eye} title="Activity status" description="Let people know when you are active in Messages."><Toggle checked={settings.activityStatus} onChange={activityStatus => update({ activityStatus })} label="Activity status" /></SettingRow></div></section>
    <section className="mt-8"><h2 className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">Media and accessibility</h2><div className="rounded-2xl border border-neutral-200 bg-white px-5 dark:border-neutral-700 dark:bg-neutral-800"><SettingRow icon={Play} title="Autoplay videos" description="Play feed videos automatically when they are in view."><Toggle checked={settings.autoplay} onChange={autoplay => update({ autoplay })} label="Autoplay videos" /></SettingRow><SettingRow icon={Gauge} title="Data saver" description="Prefer lower media use on mobile connections."><Toggle checked={settings.dataSaver} onChange={dataSaver => update({ dataSaver })} label="Data saver" /></SettingRow><SettingRow icon={Shield} title="Reduce motion" description="Limit animated transitions and movement."><Toggle checked={settings.reduceMotion} onChange={reduceMotion => update({ reduceMotion })} label="Reduce motion" /></SettingRow></div></section>
    <section className="mt-8"><h2 className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">Appearance</h2><div className="rounded-2xl border border-neutral-200 bg-white px-5 dark:border-neutral-700 dark:bg-neutral-800"><SettingRow icon={settings.theme === "dark" ? Moon : Sun} title="Theme" description="Switch between light and dark mode."><Toggle checked={settings.theme === "dark"} onChange={dark => update({ theme: dark ? "dark" : "light" })} label="Dark theme" /></SettingRow><SettingRow icon={Globe2} title="Language" description="Choose the language used in the app."><select value={settings.language} onChange={event => update({ language: event.target.value })} className="max-w-full rounded-xl border border-neutral-200 bg-transparent px-3 py-2 text-xs font-semibold dark:border-neutral-600"><option>English</option><option disabled>Spanish · coming soon</option><option disabled>French · coming soon</option></select></SettingRow></div></section>
    <section className="mt-8"><h2 className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">Account and data</h2><div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800"><Link href="/terms" className="flex items-center gap-3 border-b border-neutral-200 px-5 py-4 text-sm font-semibold dark:border-neutral-700"><Shield size={17} className="text-teal-700 dark:text-teal-300" /> Terms of Service <ChevronRight size={16} className="ml-auto text-neutral-400" /></Link><button type="button" onClick={() => window.alert("Data export will be available when your live account is connected.")} className="flex w-full items-center gap-3 border-b border-neutral-200 px-5 py-4 text-left text-sm font-semibold dark:border-neutral-700"><ArrowLeft size={17} className="rotate-[-45deg] text-teal-700 dark:text-teal-300" /> Download your data <ChevronRight size={16} className="ml-auto text-neutral-400" /></button><button type="button" onClick={() => window.alert("Account deletion will be available when your live account is connected.")} className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm font-semibold text-red-600 dark:text-red-400"><Trash2 size={17} /> Delete account <ChevronRight size={16} className="ml-auto" /></button></div></section>
    <BlockedAccounts />
  </main></AppShell>;
}
