import type { SignalLike } from "preact";
import { useSignal } from "@preact/signals";

import { ElementEditor } from "./Element.tsx";
import { type Cloneable } from "@/components/objectEditor/utils.tsx";

export function SetValue({ value, root }: { value: SignalLike<Set<Cloneable>>; root?: boolean }) {
  const idMap = useSignal(new Map<Cloneable, string>());

  const entries = [...value.value].map((item) => {
    let id = idMap.value.get(item);
    if (!id) {
      id = crypto.randomUUID();
      idMap.value = new Map(idMap.value).set(item, id);
    }
    return { item, id };
  });

  return (
    <div class={root ? "space-y-2" : "ml-2 border-l border-base-300 pl-2 space-y-2 mt-2"}>
      {entries.map(({ item, id }) => (
        <ElementEditor
          key={id}
          value={item}
          onChange={(newValue) => {
            if (newValue !== item) {
              const newSet = new Set(value.value);
              newSet.delete(item);
              newSet.add(newValue);
              value.value = newSet;

              const newMap = new Map(idMap.value);
              newMap.delete(item);
              newMap.set(newValue, id);
              idMap.value = newMap;
            }
          }}
          onDelete={() => {
            const newSet = new Set(value.value);
            newSet.delete(item);
            value.value = newSet;

            const newMap = new Map(idMap.value);
            newMap.delete(item);
            idMap.value = newMap;
          }}
        />
      ))}
      <button
        type="button"
        class="btn btn-sm btn-block"
        onClick={() => {
          value.value = new Set([...value.value, ""]);
        }}
      >
        <span class="iconify lucide--plus"></span> Add Element
      </button>
    </div>
  );
}
