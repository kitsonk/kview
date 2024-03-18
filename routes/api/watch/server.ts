import { Handlers } from "$fresh/server.ts";
import { entryMaybeToJSON } from "@kitsonk/kv-toolbox/json";
import { effect } from "@preact/signals";
import { setAccessToken } from "$utils/dash.ts";
import { getKvName, getKvPath } from "$utils/kv_state.ts";
import { state } from "$utils/state.ts";
import { type Watches } from "$utils/watches.ts";

type Stores = Map<
  string,
  { kv: Deno.Kv; reader: ReadableStreamReader<Deno.KvEntryMaybe<unknown>[]> }
>;

interface WatchNotification {
  databaseId: string;
  name?: string;
  href?: string;
  entries: Deno.KvEntryMaybe<unknown>[];
}

async function watchKv(
  databaseId: string,
  keys: Deno.KvKey[],
  name: string | undefined,
  href: string | undefined,
  controller: ReadableStreamDefaultController<WatchNotification>,
  stores: Stores,
) {
  const info = getKvPath(databaseId);
  if (!info) {
    return;
  }
  const { path, accessToken } = info;
  if (accessToken) {
    setAccessToken(accessToken);
  }
  const kv = await Deno.openKv(path);
  const reader = kv.watch(keys).getReader();
  stores.set(databaseId, { kv, reader });
  try {
    let entries;
    while (!(entries = await reader.read()).done) {
      controller.enqueue({ databaseId, entries: entries.value, name, href });
    }
  } catch {
    stores.delete(databaseId);
    kv.close();
    reader.cancel();
  }
}

function dispatch(
  watches: Watches,
  controller: ReadableStreamDefaultController<WatchNotification>,
) {
  const stores: Stores = new Map();

  for (const [databaseId, { keys, name, href }] of Object.entries(watches)) {
    watchKv(databaseId, keys, name, href, controller, stores);
  }

  return () => {
    for (const { kv, reader } of stores.values()) {
      kv.close();
      reader.cancel();
    }
    stores.clear();
  };
}

export const handler: Handlers = {
  GET(req, _ctx) {
    if (req.headers.get("upgrade") != "websocket") {
      return new Response(null, { status: 501 });
    }
    const { socket, response } = Deno.upgradeWebSocket(req);
    let dispose: (() => void) | undefined;

    const messages = new ReadableStream<WatchNotification>({
      start(controller) {
        dispose = effect(() => {
          const dispose = dispatch(state.watches.value, controller);
          return () => {
            dispose();
          };
        });
        socket.addEventListener("close", () => controller.close());
      },
      cancel() {
        dispose?.();
        socket.close();
      },
    });

    socket.addEventListener("open", async () => {
      for await (const { databaseId, entries, name, href } of messages) {
        socket.send(
          JSON.stringify({
            databaseId,
            name: name ?? getKvName(databaseId),
            href,
            entries: entries.map(entryMaybeToJSON),
          }),
        );
      }
    });
    socket.addEventListener("close", () => {
      dispose?.();
    });

    return response;
  },
};
