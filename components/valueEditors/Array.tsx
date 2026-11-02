import { type KvArrayJSON, type KvValueJSON, toValue, valueToJSON } from "@deno/kv-utils/json";
import { useSignal, useSignalEffect } from "@preact/signals";

import { ArrayValue } from "../objectEditor/ArrayValue.tsx";
import type { Cloneable } from "../objectEditor/utils.tsx";

export function ArrayValueEditor(
  { value, onChange }: { value?: KvValueJSON; onChange?: (value: KvArrayJSON) => void },
) {
  const valueSignal = useSignal(
    (value && value.type === "Array" ? toValue(value) : []) as Cloneable[],
  );
  useSignalEffect(() => {
    onChange?.(valueToJSON(valueSignal.value));
  });
  return (
    <div class="bg-base-100 border-base-300 divide-base-300 rounded-field border overflow-x-auto max-h-96 p-3 w-full">
      <ArrayValue value={valueSignal} root />
    </div>
  );
}
