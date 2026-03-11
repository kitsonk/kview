// deno-lint-ignore-file react-no-danger

import type { KvObjectJSON } from "@deno/kv-utils/json";

import { highlightJSON } from "@/utils/highlight.ts";

export function ValueObject({ value }: { value: KvObjectJSON }) {
  return (
    <div class="bg-base-100 border-base-300 divide-base-300 rounded-field border overflow-x-auto max-h-96 p-3">
      <pre><code class="overflow-hidden text-ellipsis" dangerouslySetInnerHTML={{ __html: highlightJSON(value) }} /></pre>
    </div>
  );
}
