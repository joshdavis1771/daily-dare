"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Archive, Bell, Crown, Home, MessageCircle, RefreshCw, Search, Settings, UserRound } from "lucide-react";
import { usePlus } from "@/lib/plus-store";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { notificationsEvent, readNotifications } from "@/lib/notifications";

const navItems = [
  { href: "/", label: "Today", icon: Home },
  { href: "/search", label: "People", icon: Search },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/archive", label: "Memories", icon: Archive },
  { href: "/profile", label: "Profile", icon: UserRound },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const plusState = usePlus();
  const touchStartY = useRef<number | null>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  useEffect(() => {
    const refreshNotifications = () => setHasUnreadNotifications(readNotifications().some(notification => !notification.read));
    refreshNotifications();
    window.addEventListener(notificationsEvent, refreshNotifications);
    return () => window.removeEventListener(notificationsEvent, refreshNotifications);
  }, []);
  async function openProfile(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    if (!isSupabaseConfigured || !supabase) { router.push("/profile"); return; }
    const { data: { session } } = await supabase.auth.getSession();
    router.push(session ? "/profile" : "/auth");
  }
  function handleTouchStart(event: React.TouchEvent) {
    if (window.scrollY === 0) touchStartY.current = event.touches[0]?.clientY ?? null;
  }
  function handleTouchMove(event: React.TouchEvent) {
    if (touchStartY.current === null || refreshing) return;
    const distance = Math.min(96, Math.max(0, (event.touches[0]?.clientY ?? touchStartY.current) - touchStartY.current) * 0.5);
    setPullDistance(distance);
  }
  function handleTouchEnd() {
    if (touchStartY.current === null) return;
    if (pullDistance >= 56) {
      setRefreshing(true);
      window.location.reload();
      return;
    }
    touchStartY.current = null;
    setPullDistance(0);
  }
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-100" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      {(pullDistance > 0 || refreshing) && <div className="pointer-events-none fixed left-1/2 top-3 z-50 -translate-x-1/2 rounded-full bg-white p-2 text-teal-700 shadow-lg dark:bg-neutral-800 dark:text-teal-300" style={{ transform: `translate(-50%, ${Math.min(72, pullDistance)}px)` }} aria-live="polite" aria-label={refreshing ? "Refreshing page" : "Release to refresh"}><RefreshCw size={18} className={refreshing ? "animate-spin" : ""} /></div>}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl">
        <div className="mx-auto grid h-20 max-w-xl grid-cols-[1fr_auto_1fr] items-center px-5">
          <div className="flex items-center gap-1"><Link href="/search" className="grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-teal-50 dark:hover:bg-teal-950 hover:text-teal-700 dark:hover:text-teal-300" aria-label="Find people"><Search size={21} /></Link></div>
          <Link href="/" className="flex min-h-11 w-36 items-center justify-center sm:w-44" aria-label="Daily Dare home">
            <Image src={plusState.enabled ? "/brand/daily-dare-light-plus.png" : "/brand/daily-dare-light-v2.png"} alt="Daily Dare" width={1647} height={362} unoptimized className="h-auto w-full dark:hidden" />
            <Image src={plusState.enabled ? "/brand/daily-dare-dark-plus.png" : "/brand/daily-dare-dark-v2.png"} alt="Daily Dare" width={1647} height={362} unoptimized className="hidden h-auto w-full dark:block" />
          </Link>
          <div className="flex items-center justify-end gap-1"><Link href="/plus" aria-current={pathname === "/plus" ? "page" : undefined} className={`flex h-10 items-center gap-1.5 rounded-full px-2.5 text-xs font-bold transition-colors sm:px-3 ${pathname === "/plus" ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200" : "text-amber-700 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-950"}`} aria-label="Open Daily Dare Plus"><Crown size={16} /><span className="hidden sm:inline">Plus</span></Link>{pathname === "/profile" && <Link href="/settings" className="grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-teal-50 dark:hover:bg-teal-950 hover:text-teal-700 dark:hover:text-teal-300" aria-label="Open settings" title="Settings"><Settings size={20} /></Link>}<Link href="/notifications" className="relative grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-teal-50 dark:hover:bg-teal-950 hover:text-teal-700 dark:hover:text-teal-300" aria-label="Open notifications"><Bell size={20} />{hasUnreadNotifications && <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-neutral-900" />}</Link></div>
        </div>
      </header>
      <main>{children}</main>
      <nav aria-label="Main navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-100 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl">
        <div className="mx-auto flex max-w-xl items-center justify-around px-5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            const linkClass = `flex min-h-12 min-w-16 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] transition ${active ? "bg-teal-50 dark:bg-teal-950 font-semibold text-teal-700 dark:text-teal-300" : "text-neutral-500 dark:text-neutral-300 hover:text-teal-700 dark:hover:text-teal-300"}`;
            return href === "/profile" ? <a key={href} href="/auth" onClick={openProfile} aria-current={active ? "page" : undefined} className={linkClass}><Icon size={21} strokeWidth={active ? 2.4 : 1.7} /><span>{label}</span></a> : <Link key={href} href={href} aria-current={active ? "page" : undefined} className={linkClass}><Icon size={21} strokeWidth={active ? 2.4 : 1.7} /><span>{label}</span></Link>;
          })}
        </div>
      </nav>
    </div>
  );
}