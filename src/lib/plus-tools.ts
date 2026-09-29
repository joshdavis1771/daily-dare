"use client";

import { useSyncExternalStore } from "react";
import { currentStreak, dailyPhase, type DailyState } from "./daily";
import { getDailyState } from "./daily-client";
import { todaysChallenges } from "./demo-data";
import { readPlus, writePlus } from "./plus-store";
import { spendToken } from "./plus";
import { isSupabaseConfigured } from "./supabase";

const DAILY_HISTORY_KEY = "daily-dare-days-v1";
const FUTURE_NOTE_KEY = "daily-dare-future-me";
const DAILY_HISTORY_EVENT = "daily-dare-updated";
const FUTURE_NOTE_EVENT = "daily-dare-future-note-updated";
const EMPTY_HISTORY: DailyState[] = [];

type DemoHistory = { days?: Record<string, DailyState> };
let historyRaw: string | null | undefined;
let historySnapshot = EMPTY_HISTORY;
let futureNoteRaw: string | null | undefined;
let futureNoteSnapshot = "";
let currentTime = 0;
let clockInterval: number | null = null;
const clockListeners = new Set<() => void>();

function readDemoHistoryState(): DemoHistory {
  try {
    const value = JSON.parse(window.localStorage.getItem(DAILY_HISTORY_KEY) ?? "{}") as DemoHistory;
    return value && typeof value.days === "object" && value.days !== null ? value : { days: {} };
  } catch {
    return { days: {} };
  }
}

export function getDemoHistory(): DailyState[] {
  if (typeof window === "undefined") return EMPTY_HISTORY;
  try {
    const raw = window.localStorage.getItem(DAILY_HISTORY_KEY);
    if (raw === historyRaw) return historySnapshot;
    historyRaw = raw;
    const value = JSON.parse(raw ?? "{}") as DemoHistory;
    historySnapshot = Object.values(value.days ?? {}).sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    historySnapshot = EMPTY_HISTORY;
  }
  return historySnapshot;
}

function subscribeToDailyHistory(listener: () => void) {
  window.addEventListener(DAILY_HISTORY_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(DAILY_HISTORY_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export function useDemoHistory() {
  return useSyncExternalStore(subscribeToDailyHistory, getDemoHistory, () => EMPTY_HISTORY);
}

function getFutureNoteSnapshot() {
  if (typeof window === "undefined") return "";
  try {
    const raw = window.localStorage.getItem(FUTURE_NOTE_KEY);
    if (raw !== futureNoteRaw) {
      futureNoteRaw = raw;
      futureNoteSnapshot = raw ?? "";
    }
  } catch {
    return "";
  }
  return futureNoteSnapshot;
}

function subscribeToFutureNote(listener: () => void) {
  window.addEventListener(FUTURE_NOTE_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(FUTURE_NOTE_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export function useFutureNote() {
  return useSyncExternalStore(subscribeToFutureNote, getFutureNoteSnapshot, () => "");
}

export function saveFutureNote(value: string) {
  window.localStorage.setItem(FUTURE_NOTE_KEY, value);
  futureNoteRaw = value;
  futureNoteSnapshot = value;
  window.dispatchEvent(new Event(FUTURE_NOTE_EVENT));
}

function subscribeToClock(listener: () => void) {
  clockListeners.add(listener);
  if (clockListeners.size === 1) {
    currentTime = Date.now();
    listener();
    clockInterval = window.setInterval(() => {
      currentTime = Date.now();
      clockListeners.forEach((notify) => notify());
    }, 60_000);
  }
  return () => {
    clockListeners.delete(listener);
    if (clockListeners.size === 0 && clockInterval !== null) {
      window.clearInterval(clockInterval);
      clockInterval = null;
    }
  };
}

export function useCurrentTime() {
  return useSyncExternalStore(subscribeToClock, () => currentTime, () => 0);
}

export async function spendDailyToken(kind: "skips" | "retries") {
  if (isSupabaseConfigured) throw new Error("Daily tokens are only available in the on-device demo.");
  const currentPlus = readPlus();
  const nextPlus = spendToken(currentPlus, kind);
  const day = await getDailyState();
  if (dailyPhase(day) !== "open") throw new Error("Tokens can only be used on an open, unfinished dare.");

  const history = readDemoHistoryState();
  const nextDay: DailyState = kind === "skips"
    ? { ...day, skippedAt: new Date().toISOString() }
    : { ...day, challenge: todaysChallenges.find(challenge => challenge.id !== day.challenge.id) ?? day.challenge };
  history.days ??= {};
  history.days[day.date] = nextDay;
  nextDay.streak = currentStreak(
    Object.values(history.days).filter(item => item.completedAt || item.skippedAt).map(item => item.date),
    day.date,
  );

  try {
    writePlus(nextPlus);
    window.localStorage.setItem(DAILY_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    writePlus(currentPlus);
    throw error;
  }
  window.dispatchEvent(new Event(DAILY_HISTORY_EVENT));
}
