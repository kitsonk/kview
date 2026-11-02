import type { KvBooleanJSON, KvValueJSON } from "@deno/kv-utils/json";
import { useSignal, useSignalEffect } from "@preact/signals";
import { toKvBooleanJSON } from "@/utils/kv_json.ts";

export function BooleanValueEditor(
  { value, onChange }: { value?: KvValueJSON; onChange?: (value?: KvBooleanJSON) => void },
) {
  const valueSignal = useSignal<boolean | undefined>(value?.type === "boolean" ? value.value : false);
  useSignalEffect(() => {
    if (onChange) {
      onChange(typeof valueSignal.value === "boolean" ? toKvBooleanJSON(valueSignal.value) : undefined);
    }
  });
  return (
    <form
      class="filter mx-auto"
      onChange={(evt) => {
        if (evt.target instanceof HTMLInputElement) {
          valueSignal.value = evt.target.value === "true";
        }
      }}
      onReset={() => valueSignal.value = undefined}
    >
      <input class="btn btn-square" type="reset" value="×" />
      <input class="btn" type="radio" name="value" value="true" aria-label="True" />
      <input class="btn" type="radio" name="value" value="false" aria-label="False" />
    </form>
  );
}
