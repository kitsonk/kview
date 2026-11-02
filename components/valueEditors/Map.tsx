import { type KvMapJSON, type KvValueJSON, toValue, valueToJSON } from "@deno/kv-utils/json";
import { useSignal, useSignalEffect } from "@preact/signals";

import { MapValue } from "../objectEditor/MapValue.tsx";
import type { Cloneable } from "../objectEditor/utils.tsx";

export function MapValueEditor(
  { value, onChange }: { value?: KvValueJSON; onChange?: (value: KvMapJSON) => void },
) {
  const valueSignal = useSignal(
    (value && value.type === "Map" ? toValue(value) : new Map()) as Map<Cloneable, Cloneable>,
  );
  useSignalEffect(() => {
    onChange?.(valueToJSON(valueSignal.value));
  });
  return (
    <div class="bg-base-100 border-base-300 divide-base-300 rounded-field border overflow-x-auto max-h-96 p-3 w-full">
      <MapValue value={valueSignal} root />
    </div>
  );
}
