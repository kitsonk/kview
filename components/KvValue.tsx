import type { KvKeyJSON, KvValueJSON } from "@deno/kv-utils/json";
import type { BlobMeta } from "@kitsonk/kv-toolbox/blob";

import { ValueArray } from "./values/Array.tsx";
import { ValueBigInt } from "./values/BigInt.tsx";
import { ValueKvU64 } from "./values/KvU64.tsx";
import { ValueMap } from "./values/Map.tsx";
import { ValueSet } from "./values/Set.tsx";

type KvValueProps = {
  value: KvValueJSON;
  meta?: never;
  currentKey?: never;
  storeId?: never;
} | {
  value?: never;
  meta: BlobMeta;
  currentKey: KvKeyJSON;
  storeId: string;
};

export function KvValue({ value, meta, currentKey, storeId }: KvValueProps) {
  if (value) {
    switch (value.type) {
      case "Array":
        return <ValueArray value={value} />;
      case "bigint":
        return <ValueBigInt value={value} />;
      case "KvU64":
        return <ValueKvU64 value={value} />;
      case "Map":
        return <ValueMap value={value} />;
      case "Set":
        return <ValueSet value={value} />;
      default:
        return (
          <div class="bg-base-100 border-base-300 divide-base-300 rounded-field divide-y border overflow-y-auto max-h-96 p-3">
            <pre>{JSON.stringify(value, null, 2)}</pre>
          </div>
        );
    }
  }
  if (meta && currentKey && storeId) {
    return <div class="input w-full">Blob: {meta.size} bytes</div>;
  }
}
