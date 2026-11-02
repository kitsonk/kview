import type { KvDateJSON, KvValueJSON } from "@deno/kv-utils/json";
import { useSignal, useSignalEffect } from "@preact/signals";
import { toFormString, toKvDateJSON } from "@/utils/kv_json.ts";

export function DateValueEditor({ value, onChange }: { value?: KvValueJSON; onChange?: (value: KvDateJSON) => void }) {
  const valueSignal = useSignal(value?.type === "Date" ? toFormString(value) : "");
  const datePicker = useSignal(true);
  useSignalEffect(() => {
    if (onChange) {
      onChange(toKvDateJSON(valueSignal.value));
    }
  });
  return (
    <>
      <label class="label mb-2">
        <input
          type="checkbox"
          checked={datePicker.value}
          class="toggle"
          onInput={(evt) => datePicker.value = evt.currentTarget.checked}
        />
        Date Picker
      </label>
      {datePicker.value
        ? (
          <input
            type="datetime-local"
            class="input w-full"
            value={valueSignal.value ? new Date(valueSignal.value).toISOString().slice(0, -5) : ""}
            required
            onInput={(evt) => valueSignal.value = new Date(evt.currentTarget.value).toISOString()}
          />
        )
        : (
          <>
            <label class="input validator w-full">
              <span class="iconify lucide--calendar-clock h-[1em] opacity-50"></span>
              <input
                type="text"
                pattern="\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z"
                value={valueSignal}
                title="Must be a valid ISO 8601 date string."
                required
                onInput={(evt) => {
                  const value = new Date(evt.currentTarget.value);
                  if (!isNaN(value.getTime()) && evt.currentTarget.checkValidity()) {
                    valueSignal.value = evt.currentTarget.value;
                  }
                }}
              />
            </label>
            <p class="validator-hint">
              Must be a valid ISO 8601 date string.
            </p>
          </>
        )}
    </>
  );
}
