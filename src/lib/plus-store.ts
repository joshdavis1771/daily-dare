"use client";

import { useSyncExternalStore } from "react";
import { EMPTY_PLUS, type PlusState } from "./plus";

// Premium features are intentionally disabled while the service is offline.
// Keep the code in place so it can be re-enabled later without rebuilding the
// feature architecture from scratch.
export function readPlus(): PlusState {
  return EMPTY_PLUS;
}

export function writePlus(_value: PlusState) {
  return;
}

export function updatePlus(_change: (state: PlusState) => PlusState) {
  return;
}

function subscribe(_listener: () => void) {
  return () => undefined;
}

export function usePlus() { return useSyncExternalStore(subscribe, readPlus, () => EMPTY_PLUS); }
