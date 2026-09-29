import { demoPosts, demoProfiles } from "./demo-data";

export type AppNotification = {
  id: string;
  type: "like";
  actor: { displayName: string; username: string; avatarUrl: string };
  postId?: string;
  postCaption: string;
  createdAt: string;
  read: boolean;
};

const notificationsKey = "daily-dare-notifications-v1";
export const notificationsEvent = "daily-dare-notifications-updated";
const defaultNotifications: AppNotification[] = [
  { id: "notification-alex-like", type: "like", actor: demoProfiles[1], postId: "post-1", postCaption: "My commute has entered its main character era.", createdAt: "12 min ago", read: false },
  { id: "notification-jordan-like", type: "like", actor: demoProfiles[2], postId: "post-1", postCaption: "My commute has entered its main character era.", createdAt: "1 hr ago", read: true },
];

export function readNotifications(): AppNotification[] {
  if (typeof window === "undefined") return defaultNotifications;
  try {
    const stored = window.localStorage.getItem(notificationsKey);
    if (!stored) {
      window.localStorage.setItem(notificationsKey, JSON.stringify(defaultNotifications));
      return defaultNotifications;
    }
    const saved = JSON.parse(stored) as AppNotification[];
    if (!Array.isArray(saved)) return defaultNotifications;
    const migrated = saved.map(notification => {
      if (notification.postId) return notification;
      const post = demoPosts.find(item =>
        item.caption === notification.postCaption ||
        item.caption.startsWith(notification.postCaption),
      );
      return post ? { ...notification, postId: post.id } : notification;
    });
    if (migrated.some((notification, index) => notification.postId !== saved[index]?.postId)) {
      window.localStorage.setItem(notificationsKey, JSON.stringify(migrated));
    }
    return migrated;
  } catch { return defaultNotifications; }
}

function writeNotifications(notifications: AppNotification[]) {
  window.localStorage.setItem(notificationsKey, JSON.stringify(notifications));
  window.dispatchEvent(new Event(notificationsEvent));
}

export function addLikeNotification(postCaption: string, postId?: string) {
  const notifications = readNotifications();
  const actor = demoProfiles[1];
  writeNotifications([{ id: `notification-${Date.now()}`, type: "like", actor, postId, postCaption, createdAt: "now", read: false }, ...notifications]);
}

export function markNotificationRead(id: string) {
  writeNotifications(readNotifications().map(notification =>
    notification.id === id ? { ...notification, read: true } : notification,
  ));
}

export function markNotificationsRead() {
  writeNotifications(readNotifications().map(notification => ({ ...notification, read: true })));
}
