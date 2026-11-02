import type { BlobMeta } from "@kitsonk/kv-toolbox/blob";
import type { KvEntryJSON, KvEntryMaybeJSON, KvKeyJSON } from "@deno/kv-utils/json";

export interface KvKeyListElement {
  key: KvKeyJSON;
  count: number;
  isBlob?: boolean;
}

export interface BlobEntryJSON {
  key: KvKeyJSON;
  value: never;
  meta: BlobMeta;
  versionstamp: string;
}

export type BlobEntryMaybeJSON = (KvEntryMaybeJSON & { meta: never }) | BlobEntryJSON;

export type BlobOrValueEntryJSON = (KvEntryJSON & { meta: never }) | BlobEntryJSON;

export function isEntryJSON(value: BlobEntryMaybeJSON): value is BlobOrValueEntryJSON {
  return value.versionstamp !== null;
}

export function isBlobEntryJSON(value: BlobEntryMaybeJSON): value is BlobEntryJSON {
  return value.meta != null;
}

export function isBlobMeta(value: unknown): value is BlobMeta {
  return typeof value === "object" && value !== null && "kind" in value && typeof value.kind === "string";
}
