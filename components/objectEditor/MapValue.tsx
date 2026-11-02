import type { SignalLike } from "preact";
import { useSignal, useSignalEffect } from "@preact/signals";

import { ElementEditor } from "./Element.tsx";
import { type Cloneable } from "@/components/objectEditor/utils.tsx";

export function MapValue({ value, root }: { value: SignalLike<Map<Cloneable, Cloneable>>; root?: boolean }) {
  const editEntries = useSignal([...value.peek()].map(([k, v]) => [k, v] as [Cloneable, Cloneable]));
  const ids = useSignal(editEntries.value.map(() => crypto.randomUUID()));

  useSignalEffect(() => {
    value.value = new Map(editEntries.value);
  });

  return (
    <div class={root ? "space-y-2" : "ml-2 border-l border-base-300 pl-2 space-y-2 mt-2"}>
      {editEntries.value.map(([entryKey, entryValue], index) => (
        <div key={ids.value[index]} class="border border-base-300 rounded p-2 space-y-2">
          <div class="flex items-center justify-between">
            <span class="iconify lucide--arrow-right-left text-base-content/50"></span>
            <button
              type="button"
              class="btn btn-xs btn-ghost"
              onClick={() => {
                const newEntries = [...editEntries.value];
                newEntries.splice(index, 1);
                const newIds = [...ids.value];
                newIds.splice(index, 1);
                ids.value = newIds;
                editEntries.value = newEntries;
              }}
            >
              <span class="iconify lucide--trash text-error"></span>
            </button>
          </div>
          <div class="space-y-1">
            <div class="text-xs text-base-content/70">Key</div>
            <ElementEditor
              value={entryKey}
              onChange={(newKey) => {
                if (newKey !== entryKey) {
                  const newEntries = [...editEntries.value];
                  newEntries[index] = [newKey, entryValue];
                  editEntries.value = newEntries;
                }
              }}
            />
          </div>
          <div class="space-y-1">
            <div class="text-xs text-base-content/70">Value</div>
            <ElementEditor
              value={entryValue}
              onChange={(newValue) => {
                if (newValue !== entryValue) {
                  const newEntries = [...editEntries.value];
                  newEntries[index] = [entryKey, newValue];
                  editEntries.value = newEntries;
                }
              }}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        class="btn btn-sm btn-block"
        onClick={() => {
          editEntries.value = [...editEntries.value, ["", ""]];
          ids.value = [...ids.value, crypto.randomUUID()];
        }}
      >
        <span class="iconify lucide--plus"></span> Add Entry
      </button>
    </div>
  );
}
