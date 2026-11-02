import { type KvObjectJSON, type KvValueJSON, toValue, valueToJSON } from "@deno/kv-utils/json";
import { useSignal, useSignalEffect } from "@preact/signals";

import { ObjectValue } from "../objectEditor/ObjectValue.tsx";
import type { Cloneable } from "../objectEditor/utils.tsx";

export function ObjectValueEditor(
  { value, onChange }: { value?: KvValueJSON; onChange?: (value: KvObjectJSON) => void },
) {
  const valueSignal = useSignal(
    (value && value.type === "object" ? toValue(value) : {}) as { [key: string]: Cloneable },
  );
  useSignalEffect(() => {
    onChange?.(valueToJSON(valueSignal.value));
  });
  return (
    <div class="bg-base-100 border-base-300 divide-base-300 rounded-field border overflow-x-auto max-h-96 p-3 w-full">
      <ObjectValue value={valueSignal} root />
    </div>
  );
}
