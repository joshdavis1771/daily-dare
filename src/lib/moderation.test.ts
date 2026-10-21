// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("./supabase", () => ({ supabase: null }));
import { isBlocked, reportTarget, setBlocked } from "./moderation";
const target = { userId: "p2", username: "alex", postId: "post-2" };
const key = "daily-dare-moderation-v1";
beforeEach(() => localStorage.clear());
describe("demo safety controls", () => {
  it("persists a block, avoids duplicates, and removes it on unblock", async () => {
    await setBlocked(target, true);
    await setBlocked(target, true);
    const state = JSON.parse(localStorage.getItem(key)!);
    expect(state.blocks).toHaveLength(1);
    expect(isBlocked(state.blocks, "p2")).toBe(true);
    expect(isBlocked(state.blocks, "alex")).toBe(true);
    await setBlocked(target, false);
    expect(JSON.parse(localStorage.getItem(key)!).blocks).toEqual([]);
  });
  it("saves a report without claiming it was sent to moderators", async () => {
    const result = await reportTarget(target, "Spam or scam", "  Repeated spam  ");
    expect(result).toContain("not been sent");
    expect(JSON.parse(localStorage.getItem(key)!).reports[0]).toMatchObject({ ...target, reason: "Spam or scam", details: "Repeated spam" });
  });
  it("rejects self-blocks and oversized reports", async () => {
    await expect(setBlocked({ userId: "p1", username: "me" }, true)).rejects.toThrow("yourself");
    await expect(reportTarget(target, "Other", "a".repeat(1001))).rejects.toThrow("1,000");
  });
  it("does not report success when persistence fails", async () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Storage unavailable"); });
    await expect(setBlocked(target, true)).rejects.toThrow("Storage unavailable");
    spy.mockRestore();
  });
});
