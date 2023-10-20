import { signal } from "@preact/signals";

import { type KvLocalInfo } from "./kv.ts";

function createAppState() {
  const accessToken = signal<string | undefined>(undefined);
  const localStores = signal<KvLocalInfo[] | undefined>(undefined);

  return { accessToken, localStores };
}

export const state = createAppState();
