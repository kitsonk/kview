import type { KvMapJSON } from "@deno/kv-utils/json";

import { MapEntry } from "./MapEntry.tsx";
import { childContainerClasses, rootClasses, typeBadgeClasses } from "./utils.tsx";

export function MapViewer({ value, root = false }: { value: KvMapJSON; root?: boolean }) {
  const size = value.value.length;
  return (
    <div class={root ? rootClasses : ""}>
      <details open class="viewer-details">
        <summary class="viewer-summary">
          <span class="iconify lucide--chevron-right viewer-chevron text-base-content/60"></span>
          <span class={typeBadgeClasses("Map")}>Map</span>
          <span class="text-xs text-base-content/60">{`Map(${size})`}</span>
        </summary>
        <div class={root ? "mt-2 space-y-2" : childContainerClasses}>
          {value.value.map((entry, index) => <MapEntry key={index} entry={entry} />)}
        </div>
      </details>
    </div>
  );
}
