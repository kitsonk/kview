import type { KvObjectJSON } from "@deno/kv-utils/json";

import { ObjectProperty } from "./ObjectProperty.tsx";
import { childContainerClasses, rootClasses, typeBadgeClasses } from "./utils.tsx";

export function ObjectViewer({ value, root = false }: { value: KvObjectJSON; root?: boolean }) {
  const entries = Object.entries(value.value);
  const label = entries.length === 1 ? "key" : "keys";
  return (
    <div class={root ? rootClasses : ""}>
      <details open class="viewer-details">
        <summary class="viewer-summary">
          <span class="iconify lucide--chevron-right viewer-chevron text-base-content/60"></span>
          <span class={typeBadgeClasses("object")}>Object</span>
          <span class="text-xs text-base-content/60">{`{ ${entries.length} ${label} }`}</span>
        </summary>
        <div class={root ? "mt-2 space-y-2" : childContainerClasses}>
          {entries.map(([name, val]) => <ObjectProperty key={name} name={name} value={val} />)}
        </div>
      </details>
    </div>
  );
}
