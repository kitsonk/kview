import { equals } from "@kitsonk/kv-toolbox/keys";
import { keyToJSON, type KvKeyJSON, toKey } from "@deno/kv-utils/json";

export type Watches = Record<
  string,
  { keys: Deno.KvKey[]; name?: string; href?: string }
>;

const WATCHES_KEY = "kview_watches";

export function serialize(
  watches: Watches,
): { databaseId: string; keys: KvKeyJSON[]; name?: string; href?: string }[] {
  const data: {
    databaseId: string;
    keys: KvKeyJSON[];
    name?: string;
    href?: string;
  }[] = [];
  for (const [databaseId, { keys, name, href }] of Object.entries(watches)) {
    data.push({ databaseId, keys: keys.map(keyToJSON), name, href });
  }
  return data;
}

export function getWatches(): Watches {
  const json = localStorage.getItem(WATCHES_KEY);
  const watches: Watches = Object.create(null);
  if (json) {
    for (
      const [key, { keys, name, href }] of Object.entries(
        JSON.parse(json) as Record<
          string,
          { keys: KvKeyJSON[]; name?: string; href?: string }
        >,
      )
    ) {
      try {
        watches[key] = { keys: keys.map(toKey), name, href };
      } catch {
        // just swallow here
      }
    }
  }
  return watches;
}

export function setWatches(watches: Watches) {
  const json: Record<
    string,
    { keys: KvKeyJSON[]; name?: string; href?: string }
  > = Object.create(null);
  for (const [key, { keys, name, href }] of Object.entries(watches)) {
    json[key] = { keys: keys.map(keyToJSON), name, href };
  }
  localStorage.setItem(WATCHES_KEY, JSON.stringify(json));
}

export function addWatch(
  databaseId: string,
  { key, name, href }: { key: KvKeyJSON; name?: string; href?: string },
  watches: Watches,
): Watches {
  const w = structuredClone(watches);
  if (!(databaseId in w)) {
    w[databaseId] = { keys: [] };
  }
  const kvKey = toKey(key);
  w[databaseId].name = name;
  w[databaseId].href = href;
  if (!w[databaseId].keys.some((k: Deno.KvKey) => equals(kvKey, k))) {
    w[databaseId].keys.push(kvKey);
  }
  return w;
}

export function deleteWatch(
  databaseId: string,
  key: KvKeyJSON,
  watches: Watches,
): Watches {
  const w = structuredClone(watches);
  const kvKey = toKey(key);
  if (databaseId in w) {
    w[databaseId].keys = w[databaseId].keys.filter((k: Deno.KvKey) => !equals(kvKey, k));
    if (!w[databaseId].keys.length) {
      delete w[databaseId];
    }
  }
  return w;
}
