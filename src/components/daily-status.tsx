"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Camera, Check, Flame } from "lucide-react";
import { dailyPhase, type DailyState } from "@/lib/daily";
import { getDailyState, hasDemoMissedDay, pushRequest, restoreDemoStreak } from "@/lib/daily-client";
import { isSupabaseConfigured } from "@/lib/supabase";
import { enableNativePush, isNativeApp } from "@/lib/native";

export function DailyStatus() {
  const [day, setDay] = useState<DailyState | null>(null);
  const [now, setNow] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [missedDay, setMissedDay] = useState(false);
  const refresh = useCallback(async () => {
    setNow(Date.now());
    try { setDay(await getDailyState()); setMissedDay(!isSupabaseConfigured && hasDemoMissedDay()); setError(""); }
    catch (error) { setError(error instanceof Error ? error.message : "Could not load today’s dare."); }
  }, []);
  useEffect(() => {
    const initial = setTimeout(() => void refresh(), 0);
    const timer = setInterval(() => void refresh(), 15000);
    const onVisible = () => { if (document.visibilityState === "visible") void refresh(); };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("daily-dare-updated", refresh);
    return () => { clearTimeout(initial); clearInterval(timer); document.removeEventListener("visibilitychange", onVisible); window.removeEventListener("daily-dare-updated", refresh); };
  }, [refresh]);
  useEffect(() => {
    if (!isSupabaseConfigured || !("serviceWorker" in navigator)) return;
    void navigator.serviceWorker.getRegistration("/").then(async (registration) => {
      const sub = await registration?.pushManager.getSubscription();
      if (sub) { await pushRequest("POST", sub); setEnabled(true); }
    }).catch(() => { /* The enable button lets users retry registration. */ });
  }, []);
  async function toggleNotifications() {
    setBusy(true); setMessage("");
    try {
      if (isNativeApp()) {
        await enableNativePush();
        setEnabled(true);
        setMessage("Native notification permission is enabled. Server delivery will be available once push credentials are connected.");
        return;
      }
      if (!isSupabaseConfigured || !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) throw new Error("Notifications will be available when the live app is connected. You can preview the daily deadline here.");
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) throw new Error("This browser does not support notifications. On iPhone, add Daily Dare to your Home Screen and open it there.");
      if (enabled) {
        const registration = await navigator.serviceWorker.getRegistration("/");
        const sub = await registration?.pushManager.getSubscription();
        if (sub) { await pushRequest("DELETE", sub); await sub.unsubscribe(); }
        setEnabled(false); return;
      }
      // Ask only as a direct response to the user's button press.
      if (await Notification.requestPermission() !== "granted") throw new Error("Notifications are off. You can allow them in your browser’s site settings.");
      await navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" });
      const registration = await navigator.serviceWorker.ready;
      const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      const bytes = Uint8Array.from(atob(key.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - key.length % 4) % 4)), (value) => value.charCodeAt(0));
      const sub = await registration.pushManager.getSubscription() ?? await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: bytes });
      await pushRequest("POST", sub);
      setEnabled(true);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not enable notifications."); }
    finally { setBusy(false); }
  }
  async function restoreStreak() {
    setBusy(true); setMessage("");
    try { if (isSupabaseConfigured) throw new Error("Streak payments will be available when billing is connected."); await restoreDemoStreak(); setMissedDay(false); setMessage("Your streak is restored."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Could not restore your streak."); }
    finally { setBusy(false); }
  }
  if (!day) return <section className="border-b border-neutral-200 dark:border-neutral-700 pb-7 text-center"><p className="text-sm text-neutral-500 dark:text-neutral-300">{error || "Getting today’s dare…"}</p>{error && <Link href="/auth" className="mt-3 inline-block text-sm underline">Sign in</Link>}</section>;
  const phase = dailyPhase(day, now);
  const minutes = Math.max(0, Math.ceil((Date.parse(day.deadline) - now) / 60000));
  const remaining = `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  return <section className="border-b border-neutral-200 dark:border-neutral-700 pb-7 text-center">
    <div className="mb-5 inline-flex items-center justify-center gap-1.5 rounded-full bg-red-50 dark:bg-red-950/60 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400"><Flame size={15} fill="currentColor" /><span>{day.streak} day streak</span></div>
    <p className="text-xs font-medium text-teal-700 dark:text-teal-300">{phase === "waiting" ? "A little surprise, every day" : phase === "completed" ? "You showed up today" : phase === "skipped" ? "A pause still counts" : "Today’s dare is here"}</p>
    <h1 className="mx-auto mt-3 max-w-sm text-[28px] font-bold leading-tight tracking-[-0.045em]">{phase === "waiting" ? "Your next dare is on its way." : phase === "expired" ? "A new day, a new chance." : phase === "skipped" ? "Today is protected." : phase === "completed" ? "You showed up today." : day.challenge.title}</h1>
    <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-neutral-500 dark:text-neutral-300">{phase === "waiting" ? "It drops at a random time between 9am and 8pm. Complete it by midnight to keep your streak." : phase === "completed" ? "Streak secured. Come back for tomorrow’s surprise." : phase === "skipped" ? "You used a skip. Your streak is protected, and a new dare arrives tomorrow." : phase === "expired" ? "Yesterday’s window has closed. Checking today’s dare…" : day.challenge.instructions}</p>
    {phase === "open" && <><p className="mt-4 text-xs font-semibold">{remaining} left · closes at midnight</p><Link href="/create" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-800"><Camera size={17} /> Post your dare</Link><p className="mt-3 text-xs text-neutral-500 dark:text-neutral-300">Miss the deadline and your streak resets to 0.</p></>}
    {phase === "completed" && <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-teal-50 dark:bg-teal-950 px-3 py-1.5 text-sm font-semibold text-teal-700 dark:text-teal-300"><Check size={17} /> Completed</p>}
    {phase === "skipped" && <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-teal-50 dark:bg-teal-950 px-3 py-1.5 text-sm font-semibold text-teal-700 dark:text-teal-300"><Check size={17} /> Skip used · streak protected</p>}
    {missedDay && <div className="mx-auto mt-4 max-w-sm rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left dark:border-amber-900 dark:bg-amber-950/40"><p className="text-sm font-semibold text-amber-950 dark:text-amber-100">Missed yesterday?</p><p className="mt-1 text-xs leading-relaxed text-amber-900/75 dark:text-amber-100/75">Restore your streak for $0.99 and keep your momentum.</p><button disabled={busy} onClick={restoreStreak} className="mt-3 inline-flex min-h-10 items-center rounded-full bg-amber-500 px-4 py-2 text-xs font-bold text-white hover:bg-amber-600 disabled:opacity-50">{busy ? "Restoring…" : "Restore streak · $0.99"}</button></div>}
    <div className="mt-5"><button disabled={busy} onClick={toggleNotifications} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-teal-50 dark:bg-teal-950 px-4 text-xs font-medium text-teal-700 dark:text-teal-300 transition-colors hover:bg-teal-100 dark:hover:bg-teal-900 disabled:opacity-50"><Bell size={14} />{busy ? "Updating…" : enabled ? "Turn off daily alerts" : "Notify me when it drops"}</button></div>
    <p className="mt-1 text-[11px] text-neutral-400 dark:text-neutral-400">Midnight in {day.timezone.replace(/_/g, " ")}{!isSupabaseConfigured && " · Demo streak saved on this device"}</p>
    {(message || error) && <p role="status" className="mx-auto mt-3 max-w-sm text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">{message || error}</p>}
  </section>;
}
