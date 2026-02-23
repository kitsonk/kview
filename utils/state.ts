import { signal } from "@preact/signals";

import { getLocalStores } from "./kv.ts";

async function createAppState() {
  const localStores = signal((await getLocalStores()) ?? []);

  return {
    localStores,
  };
}

export const appState = await createAppState();
