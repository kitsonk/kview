import type { SignalLike } from "preact";
import { useSignal, useSignalEffect } from "@preact/signals";

import { PropertyEditor } from "./Property.tsx";
import { type Cloneable } from "../objectEditor/utils.tsx";

export function ObjectValue({ value, root }: { value: SignalLike<{ [key: string]: Cloneable }>; root?: boolean }) {
  const editProperties = useSignal(Object.entries(value.peek()));
  const ids = useSignal(editProperties.value.map(() => crypto.randomUUID()));
  useSignalEffect(() => {
    value.value = Object.fromEntries(editProperties.value);
  });

  return (
    <div class={root ? "space-y-2" : "ml-2 border-l border-base-300 pl-2 space-y-2 mt-2"}>
      {editProperties.value.map(([name, value], index) => (
        <PropertyEditor
          key={ids.value[index]}
          name={name}
          value={value}
          onChange={(newName, newValue) => {
            if (newName !== name || newValue !== value) {
              const newProperties = [...editProperties.value];
              newProperties[index] = [newName, newValue];
              editProperties.value = newProperties;
            }
          }}
          onDelete={() => {
            const newProperties = [...editProperties.value];
            newProperties.splice(index, 1);
            const newIds = [...ids.value];
            newIds.splice(index, 1);
            ids.value = newIds;
            editProperties.value = newProperties;
          }}
        />
      ))}
      <button
        type="button"
        class="btn btn-sm btn-block"
        onClick={() => {
          editProperties.value = [...editProperties.value, ["", ""]];
          ids.value = [...ids.value, crypto.randomUUID()];
        }}
      >
        <span class="iconify lucide--plus"></span> Add Property
      </button>
    </div>
  );
}
