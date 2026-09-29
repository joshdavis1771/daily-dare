export type DailyState = {
  date: string;
  opensAt: string;
  deadline: string;
  completedAt: string | null;
  skippedAt?: string | null;
  streak: number;
  timezone: string;
  challenge: { id: string; title: string; instructions: string };
};

export function localDate(now: Date) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function previousDate(date: string) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() - 1);
  return value.toISOString().slice(0, 10);
}

export function currentStreak(completedDates: string[], today: string) {
  const dates = new Set(completedDates);
  let cursor = dates.has(today) ? today : previousDate(today);
  let streak = 0;
  while (dates.has(cursor)) { streak++; cursor = previousDate(cursor); }
  return streak;
}

export type DailyPhase = "expired" | "completed" | "skipped" | "waiting" | "open";

export function dailyPhase(day: DailyState, now = Date.now()): DailyPhase {
  if (now >= Date.parse(day.deadline)) return "expired";
  if (day.completedAt) return "completed";
  if (day.skippedAt) return "skipped";
  return now < Date.parse(day.opensAt) ? "waiting" : "open";
}

// Calendar arithmetic keeps local midnight correct on 23- and 25-hour DST days.
export function demoSchedule(now: Date, random: number) {
  const opens = new Date(now);
  opens.setHours(9, Math.floor(Math.max(0, Math.min(random, 0.99999999)) * 660), 0, 0);
  const deadline = new Date(now);
  deadline.setDate(deadline.getDate() + 1);
  deadline.setHours(0, 0, 0, 0);
  return { date: localDate(now), opensAt: opens.toISOString(), deadline: deadline.toISOString() };
}
