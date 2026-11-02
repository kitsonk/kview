import type { KvStringJSON, KvValueJSON } from "@deno/kv-utils/json";
import { useSignal, useSignalEffect } from "@preact/signals";
import { toFormString, toKvStringJSON } from "@/utils/kv_json.ts";

export function StringValueEditor(
  { value, onChange }: { value?: KvValueJSON; onChange?: (value: KvStringJSON) => void },
) {
  const valueSignal = useSignal(toFormString(value));
  useSignalEffect(() => {
    if (onChange) {
      onChange(toKvStringJSON(valueSignal.value));
    }
  });
  return (
    <textarea
      class="textarea w-full"
      name="value"
      value={valueSignal}
      placeholder="Provide a value for the entry"
      required
      onInput={(evt) => valueSignal.value = evt.currentTarget.value}
    />
  );
}
