"use client";

import { useSyncExternalStore } from "react";
import { supabase } from "./supabase";

export const reportReasons = ["Harassment or bullying", "Hate or discrimination", "Unsafe or dangerous activity", "Sexual or graphic content", "Spam or scam", "Other"] as const;
export type ReportReason = typeof reportReasons[number];
export type SafetyTarget = { userId: string; username: string; postId?: string };
type Block = { userId: string; username: string };
type SafetyState = { blocks: Block[]; reports: Array<SafetyTarget & { reason: ReportReason; details: string; createdAt: string }> };
const key = "daily-dare-moderation-v1";
const event = "daily-dare-moderation-updated";
const empty: SafetyState = { blocks: [], reports: [] };
let rawCache: string | null | undefined;
let cache = empty;

function read(): SafetyState {
  if (typeof window === "undefined") return empty;
  const raw = window.localStorage.getItem(key);
  if (raw === rawCache) return cache;
  rawCache = raw;
  try {
    const value = raw ? JSON.parse(raw) : null;
    cache = value && Array.isArray(value.blocks) && Array.isArray(value.reports) ? value : empty;
  } catch { cache = empty; }
  return cache;
}
function snapshot() { try { return read(); } catch { return cache; } }
function write(state: SafetyState) {
  window.localStorage.setItem(key, JSON.stringify(state));
  rawCache = undefined;
  window.dispatchEvent(new Event(event));
}
function subscribe(listener: () => void) {
  window.addEventListener(event, listener);
  window.addEventListener("storage", listener);
  return () => { window.removeEventListener(event, listener); window.removeEventListener("storage", listener); };
}
export function useModeration() { return useSyncExternalStore(subscribe, snapshot, () => empty); }
export function isBlocked(blocks: Block[], userIdOrUsername: string) {
  return blocks.some(block => block.userId === userIdOrUsername || block.username === userIdOrUsername);
}
// Demo IDs must never be submitted as live account IDs.
function liveTarget(id: string) { return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id); }
async function currentUser() {
  const { data, error } = await supabase!.auth.getUser();
  if (error || !data.user) throw new Error("Sign in to use safety controls.");
  return data.user.id;
}
export async function setBlocked(target: SafetyTarget, blocked: boolean) {
  if (target.userId === "p1") throw new Error("You cannot block yourself.");
  if (supabase && liveTarget(target.userId)) {
    const userId = await currentUser();
    if (userId === target.userId) throw new Error("You cannot block yourself.");
    const result = blocked
      ? await supabase.from("blocks").upsert({ blocker_id: userId, blocked_id: target.userId })
      : await supabase.from("blocks").delete().eq("blocker_id", userId).eq("blocked_id", target.userId);
    if (result.error) throw new Error("Could not update this block. Please try again.");
  }
  const state = read();
  const blocks = state.blocks.filter(block => block.userId !== target.userId);
  write({ ...state, blocks: blocked ? [...blocks, { userId: target.userId, username: target.username }] : blocks });
}
export async function reportTarget(target: SafetyTarget, reason: ReportReason, details: string) {
  if (!reportReasons.includes(reason) || details.trim().length > 1000) throw new Error("Choose a reason and keep details under 1,000 characters.");
  if (target.userId === "p1") throw new Error("You cannot report yourself.");
  if (supabase && liveTarget(target.userId)) {
    const reporterId = await currentUser();
    if (reporterId === target.userId) throw new Error("You cannot report yourself.");
    const { error } = await supabase.from("reports").insert({ reporter_id: reporterId, reported_user_id: target.userId, post_id: target.postId ?? null, reason: `${reason}${details.trim() ? `: ${details.trim()}` : ""}` });
    if (error) throw new Error("Could not submit your report. Please try again.");
    return "Report submitted. Thank you for helping keep Daily Dare safe.";
  }
  const state = read();
  write({ ...state, reports: [...state.reports, { ...target, reason, details: details.trim(), createdAt: new Date().toISOString() }] });
  return "Demo report saved on this device. It has not been sent to a moderation team.";
}
