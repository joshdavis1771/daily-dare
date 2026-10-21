import { describe, expect, it } from "vitest";
import { challengeFromPacks, validPackSelection } from "./pack-preferences";
import { PACKS, type PackId } from "./plus";

describe("signup pack preferences", () => {
  it("requires exactly three different known packs", () => {
    for (const value of [null, [], ["fitness"], ["fitness", "fitness", "food"], ["fitness", "food", "unknown"], ["fitness", "food", "home", "learning"]]) expect(validPackSelection(value)).toBe(false);
    expect(validPackSelection(["fitness", "food", "home"])).toBe(true);
  });
  it("assigns only selected packs and keeps each date stable", () => {
    const ids: PackId[] = ["food", "learning", "home"];
    const allowed = new Set(PACKS.filter(p => ids.includes(p.id)).flatMap(p => p.dares.map(d => d.id)));
    for (let day = 1; day <= 28; day++) {
      const date = `2026-10-${String(day).padStart(2, "0")}`;
      const dare = challengeFromPacks(ids, date);
      expect(allowed.has(dare.id)).toBe(true);
      expect(challengeFromPacks([...ids].reverse(), date)).toEqual(dare);
    }
  });
});
