import type { KvBigIntJSON } from "@deno/kv-utils/json";

export function ValueBigInt({ value }: { value: KvBigIntJSON }) {
  return <div class="input w-full">{value.value}n</div>;
}
