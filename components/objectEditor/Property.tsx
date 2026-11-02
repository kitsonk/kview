import { useComputed, useSignal, useSignalEffect } from "@preact/signals";

import { type Cloneable, getEditorByType, isSimpleValueType, valueTypeFromValue } from "./utils.tsx";

import { KeyEditor } from "./Key.tsx";
import { ValueTypeEditor } from "./ValueType.tsx";

export function PropertyEditor(
  { name, value, onChange, onDelete }: {
    name: string;
    value: Cloneable;
    onChange?: (name: string, value: Cloneable) => void;
    onDelete?: () => void;
  },
) {
  const valueType = useSignal(valueTypeFromValue(value));
  const editValue = useSignal<Cloneable>("");
  const nameSignal = useSignal(name);
  const editorComponent = useComputed(() => getEditorByType(valueType.value, value, editValue));
  const simpleFlag = useComputed(() => isSimpleValueType(valueType.value));
  const expanded = useSignal(true);
  useSignalEffect(() => {
    if (valueType.value === "null") {
      onChange?.(nameSignal.value, null);
    } else if (valueType.value === "undefined") {
      onChange?.(nameSignal.value, undefined);
    } else if (
      (valueType.value !== "string" && typeof editValue.value !== "string") ||
      (valueType.value === "string" && editValue.value)
    ) {
      onChange?.(nameSignal.value, editValue.value);
    }
  });
  return (
    <div class="w-full">
      <div class="flex items-center gap-2 w-full">
        {simpleFlag.value
          ? (
            <button
              type="button"
              class="btn btn-xs btn-ghost btn-circle flex-shrink-0 invisible"
              disabled
              aria-hidden="true"
            >
              <span class="iconify lucide--chevron-right"></span>
            </button>
          )
          : (
            <button
              type="button"
              class="btn btn-xs btn-ghost btn-circle flex-shrink-0"
              onClick={() => expanded.value = !expanded.value}
            >
              <span class={`iconify ${expanded.value ? "lucide--chevron-down" : "lucide--chevron-right"}`}></span>
            </button>
          )}
        <div class="flex-1 [&>*]:w-full">
          <KeyEditor value={nameSignal} />
        </div>
        <div class={simpleFlag.value ? "flex-1 [&>*]:w-full" : "flex-[2] [&>*]:w-full"}>
          <ValueTypeEditor value={valueType} />
        </div>
        {simpleFlag.value && (
          <div class="flex-1 [&>*]:w-full">
            {editorComponent}
          </div>
        )}
        <button type="button" class="btn btn-sm btn-ghost flex-shrink-0" onClick={onDelete}>
          <span class="iconify lucide--trash text-error"></span>
        </button>
      </div>
      {!simpleFlag.value && expanded.value && editorComponent}
    </div>
  );
}
