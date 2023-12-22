import { Toaster } from "$components/Toaster.tsx";
import { WatchedStore } from "$components/WatchedStore.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { equals } from "kv_toolbox/keys.ts";
import { batch, type Signal, signal } from "@preact/signals";
import { toKey } from "$utils/kv.ts";
import type { KvEntryMaybeJSON, KvKeyJSON } from "$utils/kv_json.ts";
import { addNotification } from "$utils/state.ts";

export interface WatchNotification {
  databaseId: string;
  name?: string;
  href?: string;
  entries: KvEntryMaybeJSON[];
}

const databaseIds = signal<string[]>([]);
const entries = new Map<string, Signal<KvEntryMaybeJSON[]>>();
const names = new Map<string, string>();
const hrefs = new Map<string, string>();

async function deleteKey(databaseId: string, key: KvKeyJSON) {
  const res = await fetch(new URL("/api/watch", import.meta.url), {
    method: "DELETE",
    body: JSON.stringify({ databaseId, key }),
    headers: {
      "content-type": "application/json",
    },
  });
  if (res.ok) {
    const k = toKey(key);
    const values = entries
      .get(databaseId)!.value.filter(({ key }) => !equals(k, toKey(key)));
    batch(() => {
      entries.get(databaseId)!.value = values;
      if (!values.length) {
        entries.delete(databaseId);
        names.delete(databaseId);
        hrefs.delete(databaseId);
        databaseIds.value = databaseIds.value.filter((id) => id !== databaseId);
      }
    });
    addNotification("Watch removed", "success", true);
  } else {
    addNotification("Could not delete watch.", "error", true);
  }
}

if (IS_BROWSER) {
  const url = new URL("/api/watch/server", import.meta.url);
  url.protocol = url.protocol === "http:" ? "ws:" : "wss:";
  const ws = new WebSocket(url);
  ws.addEventListener("message", ({ data }) => {
    const message: WatchNotification = JSON.parse(data);
    batch(() => {
      if (!databaseIds.value.includes(message.databaseId)) {
        if (message.name) {
          names.set(message.databaseId, message.name);
        }
        if (message.href) {
          hrefs.set(message.databaseId, message.href);
        }
        entries.set(message.databaseId, signal(message.entries));
      } else {
        entries.get(message.databaseId)!.value = message.entries;
      }
      databaseIds.value = [
        message.databaseId,
        ...databaseIds.value.filter((id) => id !== message.databaseId),
      ];
    });
  });
}

export default function Watches() {
  return databaseIds.value.length
    ? (
      <>
        <Toaster />
        {databaseIds.value.map((databaseId) => (
          <WatchedStore
            databaseId={databaseId}
            name={names.get(databaseId) ?? databaseId}
            href={hrefs.get(databaseId)}
            entries={entries.get(databaseId)!}
            deleteHandler={(key) => deleteKey(databaseId, key)}
          />
        ))}
      </>
    )
    : (
      <>
        <Toaster />
        <div class="col-span-3 p-8 flex justify-center">
          <div class="italic text-gray(600 dark:400)">no watches</div>
        </div>
      </>
    );
}
