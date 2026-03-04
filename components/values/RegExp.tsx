import type { KvRegExpJSON } from "@deno/kv-utils/json";

export function ValueRegExp({ value }: { value: KvRegExpJSON }) {
  return <div class="input w-full">{value.value}</div>;
}
