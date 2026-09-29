import { Capacitor } from "@capacitor/core";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { PushNotifications } from "@capacitor/push-notifications";
import { Preferences } from "@capacitor/preferences";
import { useSyncExternalStore } from "react";

export function isNativeApp() {
  return Capacitor.isNativePlatform();
}

function subscribeNativePlatform() {
  return () => {};
}

export function useIsNativeApp() {
  return useSyncExternalStore(subscribeNativePlatform, isNativeApp, () => false);
}

export async function captureNativePhoto() {
  if (!isNativeApp()) return null;
  const photo = await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.Uri,
    source: CameraSource.Camera,
    correctOrientation: true,
  });
  if (!photo.webPath) return null;
  const response = await fetch(photo.webPath);
  const blob = await response.blob();
  return new File([blob], `daily-dare-${Date.now()}.jpg`, { type: blob.type || "image/jpeg" });
}

export async function enableNativePush() {
  if (!isNativeApp()) return null;
  let permission = await PushNotifications.checkPermissions();
  if (permission.receive !== "granted") permission = await PushNotifications.requestPermissions();
  if (permission.receive !== "granted") throw new Error("Notifications are disabled. Enable them in your phone settings.");
  const tokenPromise = new Promise<string>((resolve, reject) => {
    let settled = false;
    const timeout = window.setTimeout(() => {
      if (!settled) reject(new Error("Could not register this device for notifications."));
    }, 10000);
    void PushNotifications.addListener("registration", (token) => {
      settled = true;
      window.clearTimeout(timeout);
      resolve(token.value);
    });
    void PushNotifications.addListener("registrationError", (error) => {
      settled = true;
      window.clearTimeout(timeout);
      reject(new Error(error.error));
    });
  });
  await PushNotifications.register();
  const token = await tokenPromise;
  await Preferences.set({ key: "daily-dare-native-push-token", value: token });
  return token;
}
