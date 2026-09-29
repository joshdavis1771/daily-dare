import type { Metadata, Viewport } from "next";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daily Dare — show up for today",
  description: "One daily challenge. One tiny proof. A more alive internet.",
  appleWebApp: { capable: true, title: "Daily Dare", statusBarStyle: "default" },
  icons: {
    icon: [{ url: "/icons/dare-192.png?v=3", type: "image/png" }, { url: "/icons/dare-512.png?v=3", type: "image/png" }],
    apple: [{ url: "/icons/dare-192.png?v=3", sizes: "192x192", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#171717",
};

const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("daily-dare-theme");
    if (!stored) {
      var settings = JSON.parse(localStorage.getItem("daily-dare-settings-v1") || "null");
      stored = settings && settings.theme;
    }
    var dark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", dark);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
    <head><script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} /></head>
    <body><PwaRegister />{children}</body>
  </html>;
}
