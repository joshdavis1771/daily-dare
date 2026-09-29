import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.dailydare.app",
  appName: "Daily Dare",
  webDir: "out",
  server: {
    url: "https://daily-dear.vercel.app",
    cleartext: false,
  },
  plugins: {
    CapacitorHttp: { enabled: true },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;