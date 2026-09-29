import { AppShell } from "@/components/app-shell";
import { DailyStatus } from "@/components/daily-status";
import { Feed } from "@/components/feed";
import { demoPosts } from "@/lib/demo-data";

export default function Home() {
  return <AppShell><div className="mx-auto max-w-xl px-5 pb-24 pt-5"><DailyStatus /><Feed initialPosts={demoPosts} /></div></AppShell>;
}
