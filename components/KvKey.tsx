import type { KvKeyJSON } from "@deno/kv-utils/json";

import { KvKeyPart } from "./KvKeyPart.tsx";

export function KvKey({ kvKey }: { kvKey: KvKeyJSON }) {
  return (
    <div class="flex space-x-2 space-y-2 flex-wrap">
      {kvKey.map((keyPart, i) => <KvKeyPart key={i} keyPart={keyPart} />)}
    </div>
  );
}
