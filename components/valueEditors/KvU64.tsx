import type { KvKvU64JSON, KvValueJSON } from "@deno/kv-utils/json";
import { useSignal, useSignalEffect } from "@preact/signals";
import { toFormString, toKvKvU64JSON } from "@/utils/kv_json.ts";

export function KvU64ValueEditor(
  { value, onChange }: { value?: KvValueJSON; onChange?: (value: KvKvU64JSON) => void },
) {
  const valueSignal = useSignal<string>(toFormString(value));
  useSignalEffect(() => {
    if (onChange) {
      onChange(toKvKvU64JSON(valueSignal.value));
    }
  });
  return (
    <>
      <label class="input validator w-full">
        <span class="iconify lucide--hash h-[1em] opacity-50"></span>
        <input
          value={valueSignal}
          type="text"
          pattern="\+?(0[xX][0-9a-fA-F]+|0[bB][01]+|0[oO][0-7]+|\d+)"
          placeholder="Provide a value for the entry"
          title="Must be a valid positive integer, hex, octal, or binary number."
          required
          onInput={(evt) => {
            if (evt.currentTarget.checkValidity()) {
              valueSignal.value = evt.currentTarget.value;
            }
          }}
        />
      </label>
      <p class="validator-hint">
        Must be a valid positive integer, hex, octal, or binary number.
      </p>
    </>
  );
}
