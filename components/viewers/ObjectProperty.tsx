import type { KvValueJSON } from "@deno/kv-utils/json";

import { PrimitiveViewer } from "./PrimitiveViewer.tsx";
import { ValueView } from "./ValueView.tsx";

import { isComplexType, keyClasses } from "./utils.tsx";

export function ObjectProperty({ name, value }: { name: string; value: KvValueJSON }) {
  if (isComplexType(value.type)) {
    return (
      <div class="flex flex-col">
        <span class={keyClasses}>"{name}":</span>
        <div class="ml-4">
          <ValueView value={value} />
        </div>
      </div>
    );
  }
  return (
    <div class="flex items-baseline gap-2 min-w-0">
      <span class={keyClasses}>"{name}"</span>
      <div class="flex-1 min-w-0 overflow-hidden">
        <PrimitiveViewer value={value} />
      </div>
    </div>
  );
}
