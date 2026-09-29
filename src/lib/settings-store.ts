"use client";

import { useSyncExternalStore } from "react";

const settingsKey = "daily-dare-settings-v1";
const themeKey = "daily-dare-theme";
const settingsEvent = "daily-dare-settings-updated";

export type SettingsState = {
  notifications: boolean;
  privateAccount: boolean;
  activityStatus: boolean;
  autoplay: boolean;
  dataSaver: boolean;
  reduceMotion: boolean;
  language: string;
  theme: "light" | "dark";
};

export const defaultSettings: SettingsState = {
  notifications: true,
  privateAccount: false,
  activityStatus: true,
  autoplay: true,
  dataSaver: false,
  reduceMotion: false,
  language: "English",
  theme: "light",
};

let cachedSignature: string | undefined;
let cachedSettings = defaultSettings;

function getSettingsSnapshot(): SettingsState {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const raw = window.localStorage.getItem(settingsKey);
    const storedTheme = window.localStorage.getItem(themeKey);
    const signature = `${raw ?? ""}\0${storedTheme ?? ""}`;
    if (signature === cachedSignature) return cachedSettings;

    const stored = raw ? JSON.parse(raw) as Partial<SettingsState> : {};
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    cachedSignature = signature;
    cachedSettings = {
      notifications: typeof stored.notifications === "boolean" ? stored.notifications : defaultSettings.notifications,
      privateAccount: typeof stored.privateAccount === "boolean" ? stored.privateAccount : defaultSettings.privateAccount,
      activityStatus: typeof stored.activityStatus === "boolean" ? stored.activityStatus : defaultSettings.activityStatus,
      autoplay: typeof stored.autoplay === "boolean" ? stored.autoplay : defaultSettings.autoplay,
      dataSaver: typeof stored.dataSaver === "boolean" ? stored.dataSaver : defaultSettings.dataSaver,
      reduceMotion: typeof stored.reduceMotion === "boolean" ? stored.reduceMotion : defaultSettings.reduceMotion,
      language: typeof stored.language === "string" ? stored.language : defaultSettings.language,
      theme: storedTheme === "dark" || storedTheme === "light"
        ? storedTheme
        : stored.theme === "dark" || stored.theme === "light" ? stored.theme : systemTheme,
    };
  } catch {
    return defaultSettings;
  }
  return cachedSettings;
}

function subscribeSettings(listener: () => void) {
  window.addEventListener(settingsEvent, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(settingsEvent, listener);
    window.removeEventListener("storage", listener);
  };
}

export function useSettings() {
  return useSyncExternalStore(subscribeSettings, getSettingsSnapshot, () => defaultSettings);
}

export function updateSettings(change: Partial<SettingsState>) {
  const next = { ...getSettingsSnapshot(), ...change };
  const serialized = JSON.stringify(next);
  window.localStorage.setItem(settingsKey, serialized);
  window.localStorage.setItem(themeKey, next.theme);
  cachedSettings = next;
  cachedSignature = `${serialized}\0${next.theme}`;
  document.documentElement.classList.toggle("dark", next.theme === "dark");
  document.documentElement.dataset.reduceMotion = String(next.reduceMotion);
  window.dispatchEvent(new Event(settingsEvent));
}