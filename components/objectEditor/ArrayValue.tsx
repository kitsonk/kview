import type { SignalLike } from "preact";
import { useSignal } from "@preact/signals";

import { ElementEditor } from "./Element.tsx";
import { type Cloneable } from "@/components/objectEditor/utils.tsx";

export function ArrayValue({ value, root }: { value: SignalLike<Cloneable[]>; root?: boolean }) {
  const ids = useSignal(value.value.map(() => crypto.randomUUID()));

  return (
    <div class={root ? "space-y-2" : "ml-2 border-l border-base-300 pl-2 space-y-2 mt-2"}>
      {value.value.map((item, index) => (
        <ElementEditor
          key={ids.value[index]}
          index={index}
          value={item}
          onChange={(newValue) => {
            if (newValue !== item) {
              const newValues = [...value.value];
              newValues[index] = newValue;
              value.value = newValues;
            }
          }}
          onDelete={() => {
            const newElements = [...value.value];
            newElements.splice(index, 1);
            const newIds = [...ids.value];
            newIds.splice(index, 1);
            ids.value = newIds;
            value.value = newElements;
          }}
        />
      ))}
      <button
        type="button"
        class="btn btn-sm btn-block"
        onClick={() => {
          ids.value = [...ids.value, crypto.randomUUID()];
          value.value = [...value.value, ""];
        }}
      >
        <span class="iconify lucide--plus"></span> Add Element
      </button>
    </div>
  );
}
