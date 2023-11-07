import { type ComponentChildren } from "preact";
import { signal } from "@preact/signals";

import { type KvLocalInfo } from "./kv.ts";

type NotificationType = "error" | "warning" | "success";

export interface Notification {
  type: NotificationType;
  message: ComponentChildren;
  id: number;
  dismissible?: boolean;
}

function createAppState() {
  const accessToken = signal<string | undefined>(undefined);
  const localStores = signal<KvLocalInfo[] | undefined>(undefined);
  const notifications = signal<Notification[]>([]);

  return { accessToken, localStores, notifications };
}

export const state = createAppState();

let id = 0;

export function addNotification(
  message: ComponentChildren,
  type: NotificationType,
  dismissible?: boolean,
  expire = 10,
) {
  id++;
  const notification = { message, type, dismissible, id };
  setTimeout(() => {
    state.notifications.value = state
      .notifications.value.filter(({ id: i }) => i !== id);
  }, expire * 1000);
  state.notifications.value = [...state.notifications.value, notification];
}
