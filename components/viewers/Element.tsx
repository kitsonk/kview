import type { KvValueJSON } from "@deno/kv-utils/json";

import { ValueView } from "./ValueView.tsx";

import { indexClasses } from "./utils.tsx";

export function Element({ index, value }: { index: number; value: KvValueJSON }) {
  return (
    <div class="flex items-baseline gap-2 min-w-0">
      <span class={indexClasses}>{index}:</span>
      <div class="flex-1 min-w-0 overflow-hidden">
        <ValueView value={value} />
      </div>
    </div>
  );
}
