"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Bell, Heart } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { markNotificationRead, markNotificationsRead, notificationsEvent, readNotifications, type AppNotification } from "@/lib/notifications";

function NotificationItem({ notification }: { notification: AppNotification }) {
  const href = notification.postId
    ? `/profile?post=${encodeURIComponent(notification.postId)}`
    : `/profile/${notification.actor.username}`;
  return <Link href={href} onClick={() => markNotificationRead(notification.id)} aria-label={`${notification.actor.displayName} liked your post: ${notification.postCaption}`} className={`flex items-center gap-3 border-b border-neutral-200 px-5 py-4 outline-none transition-colors last:border-b-0 hover:bg-teal-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-600 dark:border-neutral-700 dark:hover:bg-teal-950/40 dark:focus-visible:ring-teal-300 ${notification.read ? "" : "bg-teal-50/60 dark:bg-teal-950/30"}`}><Image src={notification.actor.avatarUrl} alt="" width={44} height={44} unoptimized className="h-11 w-11 rounded-full object-cover" /><span className="min-w-0 flex-1 text-sm leading-relaxed"><strong>{notification.actor.displayName}</strong> liked your post <span className="text-neutral-500 dark:text-neutral-400">“{notification.postCaption}”</span><span className="mt-1 block text-xs text-neutral-400">{notification.createdAt}</span></span><Heart size={18} className="shrink-0 text-red-500" fill="currentColor" /></Link>;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  useEffect(() => {
    const refresh = () => setNotifications(readNotifications());
    refresh();
    window.addEventListener(notificationsEvent, refresh);
    return () => window.removeEventListener(notificationsEvent, refresh);
  }, []);
  function markRead() {
    markNotificationsRead();
    setNotifications(readNotifications());
  }
  const unreadCount = notifications.filter(notification => !notification.read).length;
  return <AppShell><main className="mx-auto max-w-2xl px-5 pb-32 pt-10 lg:px-10"><Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold text-teal-700 dark:text-teal-300"><ArrowLeft size={16} /> Back to today</Link><div className="mt-8 flex items-end justify-between gap-4"><div><p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300"><Bell size={15} /> Your activity</p><h1 className="mt-2 text-4xl font-black tracking-tight">Notifications</h1></div>{unreadCount > 0 && <button type="button" onClick={markRead} className="text-xs font-semibold text-teal-700 underline dark:text-teal-300">Mark all read</button>}</div><section className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">{notifications.length ? notifications.map(notification => <NotificationItem key={notification.id} notification={notification} />) : <div className="p-10 text-center"><Bell size={24} className="mx-auto text-neutral-300" /><p className="mt-3 text-sm text-neutral-500">No notifications yet.</p></div>}</section></main></AppShell>;
}
