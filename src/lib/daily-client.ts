import { supabase } from "./supabase";
import { currentStreak, dailyPhase, demoSchedule, localDate, type DailyState } from "./daily";
import { getDailyChallengeForUser } from "./demo-data";

import { MEDIA_EXTENSIONS, validateMediaFile, validateUserText } from "./utils";

const KEY = "daily-dare-days-v1";
const RESTORED_KEY = "daily-dare-streak-restored-v1";
type DemoHistory = { days: Record<string, DailyState> };

function readDemo(): DemoHistory {
  const raw = localStorage.getItem(KEY);
  if (!raw) return { days: {} };
  try {
    const data = JSON.parse(raw);
    if (data && typeof data.days === "object" && data.days !== null) return data;
  } catch { /* A malformed demo history starts fresh. */ }
  return { days: {} };
}

export function hasDemoMissedDay() {
  const history = readDemo();
  const today = localDate(new Date());
  return Object.values(history.days).some(day => day.date < today && !day.completedAt && !day.skippedAt && Date.parse(day.deadline) < Date.now());
}

export async function restoreDemoStreak() {
  const history = readDemo();
  const today = localDate(new Date());
  const missed = Object.values(history.days).filter(day => day.date < today && !day.completedAt && Date.parse(day.deadline) < Date.now()).sort((a, b) => b.date.localeCompare(a.date))[0];
  if (!missed) throw new Error("There is no missed day to restore.");
  history.days[missed.date] = { ...missed, completedAt: new Date().toISOString() };
  localStorage.setItem(KEY, JSON.stringify(history));
  localStorage.setItem(RESTORED_KEY, new Date().toISOString());
  window.dispatchEvent(new Event("daily-dare-updated"));
}

export async function getDailyState(): Promise<DailyState> {
  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Sign in to start your daily streak.");
    const { data, error } = await supabase.rpc("daily_status", { p_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone });
    if (error) throw new Error("Daily challenges are unavailable. Please try again shortly.");
    return data as DailyState;
  }
  const history = readDemo();
  const schedule = demoSchedule(new Date(), crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296);
  const day = history.days[schedule.date] ?? {
    ...schedule, completedAt: null, streak: 0,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    challenge: getDailyChallengeForUser("p1"),
  };
  day.streak = currentStreak(Object.values(history.days).filter((item) => item.completedAt || item.skippedAt).map((item) => item.date), day.date);
  history.days[day.date] = day;
  localStorage.setItem(KEY, JSON.stringify(history));
  return day;
}

export async function submitDailyProof(day: DailyState, file: File, caption: string) {
  const validationError = validateMediaFile(file);
  if (validationError) throw new Error(validationError);
  const textError = validateUserText(caption);
  if (textError) throw new Error(textError);
  if (dailyPhase(day) !== "open") throw new Error("This dare is not open for submission. Refresh to see today’s status.");
  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Sign in before posting your dare.");
    const extension = MEDIA_EXTENSIONS[file.type];
    const path = `${session.user.id}/${day.date}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from("daily-proofs").upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) throw new Error("Your photo or video could not be uploaded. Please try again.");
    const { error } = await supabase.rpc("complete_daily_dare", { p_date: day.date, p_video_path: path, p_caption: caption });
    if (error) {
      await supabase.storage.from("daily-proofs").remove([path]);
      throw new Error("Your dare could not be submitted. The midnight deadline may have passed; refresh and try again.");
    }
  } else {
    const current = await getDailyState();
    if (current.date !== day.date || dailyPhase(current) !== "open") throw new Error("This dare has closed or was already completed.");
    // Demo records completion on this device; the media never leaves the browser.
    const history = readDemo();
    history.days[day.date] = { ...current, completedAt: new Date().toISOString() };
    localStorage.setItem(KEY, JSON.stringify(history));
  }
  window.dispatchEvent(new Event("daily-dare-updated"));
  return getDailyState();
}

export async function pushRequest(method: "POST" | "DELETE", subscription: PushSubscription) {
  const { data } = await supabase!.auth.getSession();
  if (!data.session) throw new Error("Sign in to enable notifications.");
  const result = await fetch("/api/push", {
    method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session.access_token}` },
    body: JSON.stringify(subscription.toJSON()),
  });
  if (!result.ok) throw new Error("Notifications could not be saved. Please try again.");
}
