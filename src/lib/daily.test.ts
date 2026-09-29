import { describe, expect, it } from "vitest";
import { currentStreak, dailyPhase, demoSchedule, localDate, previousDate, type DailyState } from "./daily";
import { validPushEndpoint, validPushKey } from "./server/push";

const day: DailyState = {
  date: "2026-09-17", opensAt: "2026-09-17T09:00:00Z", deadline: "2026-09-18T00:00:00Z",
  completedAt: null, streak: 3, timezone: "UTC", challenge: { id: "1", title: "Test", instructions: "Test" },
};

describe("daily streak rules", () => {
  it("uses the device's local calendar date", () => {
    expect(localDate(new Date(2026, 8, 17, 23, 59))).toBe("2026-09-17");
  });
  it("keeps yesterday’s streak until today ends, then resets after a missed day", () => {
    const history = ["2026-09-14", "2026-09-15", "2026-09-16"];
    expect(currentStreak(history, "2026-09-17")).toBe(3);
    expect(currentStreak(history, "2026-09-18")).toBe(0);
    expect(currentStreak([...history, "2026-09-18"], "2026-09-18")).toBe(1);
  });
  it("counts each date once across month/year/leap boundaries", () => {
    expect(currentStreak(["2025-12-31", "2026-01-01", "2026-01-01"], "2026-01-01")).toBe(2);
    expect(previousDate("2024-03-01")).toBe("2024-02-29");
    expect(currentStreak([], "2026-09-17")).toBe(0);
  });
  it("opens exactly at drop time and closes exactly at midnight", () => {
    expect(dailyPhase(day, Date.parse(day.opensAt) - 1)).toBe("waiting");
    expect(dailyPhase(day, Date.parse(day.opensAt))).toBe("open");
    expect(dailyPhase(day, Date.parse(day.deadline) - 1)).toBe("open");
    expect(dailyPhase(day, Date.parse(day.deadline))).toBe("expired");
    expect(dailyPhase({ ...day, completedAt: day.opensAt }, Date.parse(day.opensAt))).toBe("completed");
  });
  it("protects a skipped day until its deadline without reopening proof submission", () => {
    const skipped = { ...day, skippedAt: day.opensAt };
    expect(dailyPhase(skipped, Date.parse(day.opensAt))).toBe("skipped");
    expect(dailyPhase(skipped, Date.parse(day.deadline))).toBe("expired");
  });
  it("schedules between 9am and 8pm with next local midnight as the deadline", () => {
    const now = new Date(2026, 8, 17, 12);
    expect(new Date(demoSchedule(now, 0).opensAt).getHours()).toBe(9);
    const last = new Date(demoSchedule(now, 0.99999).opensAt);
    expect(last.getHours()).toBe(19);
    expect(last.getMinutes()).toBe(59);
    const deadline = new Date(demoSchedule(now, 0.5).deadline);
    expect(deadline.getDate()).toBe(18);
    expect(deadline.getHours()).toBe(0);
  });
});

describe("push destination validation", () => {
  it("accepts known push services and rejects arbitrary/internal/credentialed URLs", () => {
    expect(validPushEndpoint("https://fcm.googleapis.com/fcm/send/123")).toBe(true);
    expect(validPushEndpoint("https://web.push.apple.com/123")).toBe(true);
    for (const value of ["http://fcm.googleapis.com/a", "https://127.0.0.1/a", "https://fcm.googleapis.com.attacker.test/a", "https://user:pass@fcm.googleapis.com/a", "https://fcm.googleapis.com:8443/a", null]) expect(validPushEndpoint(value)).toBe(false);
  });
  it("checks push key encoding and byte length", () => {
    expect(validPushKey(Buffer.alloc(65).toString("base64url"), 65)).toBe(true);
    expect(validPushKey(Buffer.alloc(16).toString("base64url"), 65)).toBe(false);
    expect(validPushKey("not a key!", 16)).toBe(false);
  });
});
