// deno-lint-ignore-file react-no-danger
import { type KvArrayJSON } from "@deno/kv-utils/json";

import { highlightJSON } from "@/utils/highlight.ts";

export function ValueArray({ value }: { value: KvArrayJSON }) {
  return (
    <div class="bg-base-100 border-base-300 divide-base-300 rounded-field border overflow-x-auto max-h-96">
      <pre><code dangerouslySetInnerHTML={{ __html: highlightJSON(value) }}/></pre>
    </div>
  );
}
