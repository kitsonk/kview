import type { KvDateJSON, KvNumberJSON, KvStringJSON } from "@deno/kv-utils/json";

export function ValueField({ value }: { value: KvNumberJSON | KvDateJSON | KvStringJSON }) {
  return (
    <div class="bg-base-100 border-base-300 divide-base-300 rounded-field border overflow-x-auto max-h-96 p-3">
      {value.value}
    </div>
  );
}
