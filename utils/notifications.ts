import { signal } from "@preact/signals";

export type NotificationKind = "info" | "success" | "warning" | "error";

export interface Notification {
  id: number;
  kind: NotificationKind;
  message: string;
}

export const notifications = signal<Notification[]>([]);

let nextId = 1;

export function notify(kind: NotificationKind, message: string, ttl = 4000): number {
  const id = nextId++;
  notifications.value = [...notifications.value, { id, kind, message }];
  if (ttl > 0) {
    setTimeout(() => dismissNotification(id), ttl);
  }
  return id;
}

export function dismissNotification(id: number): void {
  notifications.value = notifications.value.filter((n) => n.id !== id);
}
