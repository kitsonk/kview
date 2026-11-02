import type { KvNumberJSON, KvValueJSON } from "@deno/kv-utils/json";
import { useSignal, useSignalEffect } from "@preact/signals";
import { toFormString, toKvNumberJSON } from "@/utils/kv_json.ts";

export function NumberValueEditor(
  { value, onChange }: { value?: KvValueJSON; onChange?: (value: KvNumberJSON) => void },
) {
  const valueSignal = useSignal(value?.type === "number" ? toFormString(value) : "");
  useSignalEffect(() => {
    if (onChange) {
      onChange(toKvNumberJSON(valueSignal.value));
    }
  });
  return (
    <>
      <label class="input validator w-full">
        <span class="iconify lucide--hash h-[1em] opacity-50"></span>
        <input
          value={valueSignal}
          type="text"
          pattern="[+\-]?(0[xX][0-9a-fA-F]+|0[bB][01]+|0[oO][0-7]+|\d+(\.\d+)?|Infinity|-Infinity|NaN)"
          placeholder="Provide a value for the entry"
          title="Only a number, 'Infinity', '-Infinity', or 'NaN' is allowed."
          required
          onInput={(evt) => {
            if (evt.currentTarget.checkValidity()) {
              valueSignal.value = evt.currentTarget.value;
            }
          }}
        />
      </label>
      <p class="validator-hint">
        Only a number, "Infinity", "-Infinity", or "NaN" is allowed.
      </p>
    </>
  );
}
