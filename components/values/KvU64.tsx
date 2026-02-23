import type { KvKvU64JSON } from "@deno/kv-utils/json";

export function ValueKvU64({ value }: { value: KvKvU64JSON }) {
  return <div class="input w-full">{value.value}n</div>;
}
