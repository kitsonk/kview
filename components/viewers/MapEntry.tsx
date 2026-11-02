import type { KvValueJSON } from "@deno/kv-utils/json";

import { PrimitiveViewer } from "./PrimitiveViewer.tsx";
import { ValueView } from "./ValueView.tsx";

import { isComplexType } from "./utils.tsx";

export function MapEntry({ entry }: { entry: readonly [KvValueJSON, KvValueJSON] }) {
  return (
    <div class="border border-base-300 rounded-field p-2 space-y-1">
      <div class="flex items-baseline gap-2 min-w-0">
        <span class="text-xs text-base-content/60 font-mono shrink-0">key</span>
        <div class="flex-1 min-w-0 overflow-hidden">
          <PrimitiveViewer value={entry[0]} />
        </div>
      </div>
      <div class="flex items-baseline gap-2 min-w-0">
        <span class="text-xs text-base-content/60 font-mono shrink-0">val</span>
        <div class="flex-1 min-w-0 overflow-hidden">
          {isComplexType(entry[1].type) ? <ValueView value={entry[1]} /> : <PrimitiveViewer value={entry[1]} />}
        </div>
      </div>
    </div>
  );
}
