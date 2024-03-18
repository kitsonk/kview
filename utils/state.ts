import type { KvKeyJSON } from "kv-toolbox/json";
import { type ComponentChildren } from "preact";
import { effect, signal } from "@preact/signals";

import { type KvLocalInfo } from "./kv.ts";
import { getRemoteStores, setRemoteStores } from "./remoteStores.ts";
import { getWatches, setWatches } from "./watches.ts";

type NotificationType = "error" | "warning" | "success";

export interface Notification {
  type: NotificationType;
  message: ComponentChildren;
  id: number;
  dismissible?: boolean;
}

export interface KvWatchJson {
  databaseId: string;
  key: KvKeyJSON;
}

function createAppState() {
  const accessToken = signal<string | undefined>(undefined);
  const sessionToken = signal<string | undefined>(undefined);
  const localStores = signal<KvLocalInfo[] | undefined>(undefined);
  const remoteStores = signal(getRemoteStores());
  const watches = signal(getWatches());
  const notifications = signal<Notification[]>([]);

  effect(() => setRemoteStores(remoteStores.value));
  effect(() => setWatches(watches.value));

  return {
    accessToken,
    sessionToken,
    localStores,
    remoteStores,
    watches,
    notifications,
  };
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
