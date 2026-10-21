import { PACKS, type PackId } from "./plus";

export const PACK_PREFERENCES_KEY = "daily-dare-selected-packs-v1";
export function validPackSelection(value: unknown): value is PackId[] {
  return Array.isArray(value) && value.length === 3 && new Set(value).size === 3 && value.every(id => PACKS.some(pack => pack.id === id));
}
export function readPackPreferences(): PackId[] | null {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(PACK_PREFERENCES_KEY) ?? "null");
    return validPackSelection(value) ? value : null;
  } catch { return null; }
}
export function challengeFromPacks(ids: PackId[], date: string, userId = "p1") {
  if (!validPackSelection(ids)) throw new Error("Choose exactly three packs.");
  const pool = PACKS.filter(pack => ids.includes(pack.id)).flatMap(pack => pack.dares);
  const hash = Array.from(`${userId}:${date}`).reduce((value, char) => (value * 31 + char.charCodeAt(0)) >>> 0, 0);
  const dare = pool[hash % pool.length];
  return { id: dare.id, title: dare.title, instructions: dare.instructions };
}
