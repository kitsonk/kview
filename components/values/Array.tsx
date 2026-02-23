import { type KvArrayJSON } from "@deno/kv-utils/json";

import { highlightJSON } from "@/utils/highlight.ts";

export function ValueArray({ value }: { value: KvArrayJSON }) {
  // deno-lint-ignore react-no-danger
  return <div class="input w-full" dangerouslySetInnerHTML={{ __html: highlightJSON(value) }} />;
}
