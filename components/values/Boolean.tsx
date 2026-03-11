import type { KvBooleanJSON } from "@deno/kv-utils/json";

export function ValueBoolean({ value }: { value: KvBooleanJSON }) {
  return (
    <div class="bg-base-100 border-base-300 divide-base-300 rounded-field border overflow-x-auto max-h-96 p-3">
      {value.value ? "true" : "false"}
    </div>
  );
}
