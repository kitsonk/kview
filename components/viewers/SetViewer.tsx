import type { KvSetJSON, KvValueJSON } from "@deno/kv-utils/json";

import { Element } from "./Element.tsx";
import { childContainerClasses, rootClasses, typeBadgeClasses } from "./utils.tsx";

export function SetViewer({ value, root = false }: { value: KvSetJSON; root?: boolean }) {
  const size = value.value.length;
  return (
    <div class={root ? rootClasses : ""}>
      <details open class="viewer-details">
        <summary class="viewer-summary">
          <span class="iconify lucide--chevron-right viewer-chevron text-base-content/60"></span>
          <span class={typeBadgeClasses("Set")}>Set</span>
          <span class="text-xs text-base-content/60">{`Set(${size})`}</span>
        </summary>
        <div class={root ? "mt-2 space-y-2" : childContainerClasses}>
          {value.value.map((item: KvValueJSON, index: number) => <Element key={index} index={index} value={item} />)}
        </div>
      </details>
    </div>
  );
}
