import { type KvSetJSON, type KvValueJSON, toValue, valueToJSON } from "@deno/kv-utils/json";
import { useSignal, useSignalEffect } from "@preact/signals";

import { SetValue } from "../objectEditor/SetValue.tsx";
import type { Cloneable } from "../objectEditor/utils.tsx";

export function SetValueEditor(
  { value, onChange }: { value?: KvValueJSON; onChange?: (value: KvSetJSON) => void },
) {
  const valueSignal = useSignal(
    (value && value.type === "Set" ? toValue(value) : new Set()) as Set<Cloneable>,
  );
  useSignalEffect(() => {
    onChange?.(valueToJSON(valueSignal.value));
  });
  return (
    <div class="bg-base-100 border-base-300 divide-base-300 rounded-field border overflow-x-auto max-h-96 p-3 w-full">
      <SetValue value={valueSignal} root />
    </div>
  );
}
