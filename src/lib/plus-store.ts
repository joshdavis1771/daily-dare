"use client";

import { useSyncExternalStore } from "react";
import { currentWeekKey, EMPTY_PLUS, PLUS_EVENT, PLUS_KEY, PLUS_PLANS, refreshWeeklyTokens, THEMES, type PlusState } from "./plus";
let cachedRaw: string | null = null;
let cachedState = EMPTY_PLUS;
export function readPlus(): PlusState {
  if (typeof window === "undefined") return EMPTY_PLUS;
  try {
    const raw = localStorage.getItem(PLUS_KEY);
    if (raw === cachedRaw) { cachedState = refreshWeeklyTokens(cachedState); return cachedState; }
    cachedRaw = raw;
    const value = raw ? JSON.parse(raw) : null;
    const valid = value?.version === 1 && typeof value.enabled === "boolean" && Array.isArray(value.groups) && Array.isArray(value.dares) && Array.isArray(value.savedPacks) && value.profile && THEMES.includes(value.profile.theme) && THEMES.includes(value.profile.icon) && typeof value.completed === "object" && value.completed !== null && Number.isInteger(value.skips) && value.skips >= 0 && Number.isInteger(value.retries) && value.retries >= 0;
    cachedState = valid ? refreshWeeklyTokens({ ...value, plan: PLUS_PLANS.includes(value.plan) ? value.plan : "Yearly", retryWeek: typeof value.retryWeek === "string" ? value.retryWeek : "" }) : { ...EMPTY_PLUS, retryWeek: currentWeekKey() };
    return cachedState;
  } catch { return EMPTY_PLUS; }
}
export function writePlus(value: PlusState) {
  try { localStorage.setItem(PLUS_KEY, JSON.stringify(value)); }
  catch { throw new Error("Your browser couldn’t save this change. Free up storage or allow site storage and try again."); }
  window.dispatchEvent(new Event(PLUS_EVENT));
}
export function updatePlus(change: (state: PlusState) => PlusState) { writePlus(change(readPlus())); }
function subscribe(listener: () => void) {
  window.addEventListener(PLUS_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => { window.removeEventListener(PLUS_EVENT, listener); window.removeEventListener("storage", listener); };
}
export function usePlus() { return useSyncExternalStore(subscribe, readPlus, () => EMPTY_PLUS); }
