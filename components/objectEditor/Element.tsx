import { useComputed, useSignal, useSignalEffect } from "@preact/signals";

import { type Cloneable, getEditorByType, isSimpleValueType, valueTypeFromValue } from "./utils.tsx";

import { ValueTypeEditor } from "./ValueType.tsx";

export function ElementEditor(
  { index, value, onChange, onDelete }: {
    index?: number;
    value: Cloneable;
    onChange?: (value: Cloneable) => void;
    onDelete?: () => void;
  },
) {
  const valueType = useSignal(valueTypeFromValue(value));
  const editValue = useSignal<Cloneable>("");
  const editorComponent = useComputed(() => getEditorByType(valueType.value, value, editValue));
  const simpleFlag = useComputed(() => isSimpleValueType(valueType.value));
  const expanded = useSignal(true);
  useSignalEffect(() => {
    if (valueType.value === "null") {
      onChange?.(null);
    } else if (valueType.value === "undefined") {
      onChange?.(undefined);
    } else if (
      (valueType.value !== "string" && typeof editValue.value !== "string") ||
      (valueType.value === "string" && editValue.value)
    ) {
      onChange?.(editValue.value);
    }
  });
  return simpleFlag.value
    ? (
      <div class="flex items-center gap-2">
        {index !== undefined && <div class="text-xs px-1 text-neutral">{index}:</div>}
        <ValueTypeEditor value={valueType} />
        {editorComponent}
        {onDelete && (
          <button type="button" class="btn btn-sm btn-ghost" onClick={onDelete}>
            <span class="iconify lucide--trash text-error"></span>
          </button>
        )}
      </div>
    )
    : (
      <div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="btn btn-xs btn-ghost btn-circle"
            onClick={() => expanded.value = !expanded.value}
          >
            <span class={`iconify ${expanded.value ? "lucide--chevron-down" : "lucide--chevron-right"}`}></span>
          </button>
          {index !== undefined && <div class="text-xs px-1 text-neutral">{index}:</div>}
          <ValueTypeEditor value={valueType} />
          {onDelete && (
            <button type="button" class="btn btn-sm btn-ghost" onClick={onDelete}>
              <span class="iconify lucide--trash text-error"></span>
            </button>
          )}
        </div>
        {expanded.value && editorComponent}
      </div>
    );
}
