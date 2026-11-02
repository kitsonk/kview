import type { KvRegExpJSON, KvValueJSON } from "@deno/kv-utils/json";
import { useSignal, useSignalEffect } from "@preact/signals";
import { toFormString, toKvRegExpJSON } from "@/utils/kv_json.ts";

export function RegExpValueEditor(
  { value, onChange }: { value?: KvValueJSON; onChange?: (value: KvRegExpJSON) => void },
) {
  const valueSignal = useSignal(toFormString(value));
  useSignalEffect(() => {
    if (onChange) {
      onChange(toKvRegExpJSON(valueSignal.value));
    }
  });
  return (
    <>
      <label class="input validator w-full">
        <span class="iconify lucide--regex h-[1em] opacity-50"></span>
        <input
          value={valueSignal}
          type="text"
          pattern="\/(?![*+?])([^\r\n\[\/\\]|\\.|\[([^\r\n\]\\]|\\.)*\])+/(g(im?|mi?)?|i(gm?|mg?)?|m(gi?|ig?)?)?"
          placeholder="Provide a value for the entry"
          title="Must be a valid regular expression."
          required
          onInput={(evt) => {
            if (evt.currentTarget.checkValidity()) {
              valueSignal.value = evt.currentTarget.value;
            }
          }}
        />
      </label>
      <p class="validator-hint">
        Must be a valid regular expression.
      </p>
    </>
  );
}
