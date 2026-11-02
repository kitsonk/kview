import type { KvValueJSON } from "@deno/kv-utils/json";
import { useComputed, useSignal, useSignalEffect } from "@preact/signals";

import { ArrayValueEditor } from "./Array.tsx";
import { BigIntValueEditor } from "./BigInt.tsx";
import { BooleanValueEditor } from "./Boolean.tsx";
import { DateValueEditor } from "./Date.tsx";
import { ErrorValueEditor } from "./Error.tsx";
import { KvU64ValueEditor } from "./KvU64.tsx";
import { MapValueEditor } from "./Map.tsx";
import { NumberValueEditor } from "./Number.tsx";
import { ObjectValueEditor } from "./Object.tsx";
import { RegExpValueEditor } from "./RegExp.tsx";
import { SetValueEditor } from "./Set.tsx";
import { StaticValueEditor } from "./Static.tsx";
import { StringValueEditor } from "./String.tsx";

type KvValueType = KvValueJSON["type"];

function getKvValueType(value: KvValueJSON | undefined): KvValueType {
  return value?.type ?? "string";
}

function isSimpleValueType(type: KvValueType): boolean {
  return ["null", "undefined", "number", "boolean", "string", "bigint", "RegExp", "Date"].includes(type);
}

export function ValueEditor(
  { value, onChange, onDelete, label }: {
    value?: KvValueJSON;
    onChange?: (value?: KvValueJSON) => void;
    onDelete?: () => void;
    label?: string;
  },
) {
  const valueType = useSignal<KvValueType>(getKvValueType(value));
  const currentValue = useSignal<KvValueJSON | undefined>(value);
  const simpleFlag = useComputed(() => isSimpleValueType(valueType.value));
  const expanded = useSignal(true);

  const valueEditor = useComputed(() => {
    const update = (v?: KvValueJSON) => currentValue.value = v;
    switch (valueType.value) {
      case "Array":
        return <ArrayValueEditor value={currentValue.value} onChange={update} />;
      case "bigint":
        return <BigIntValueEditor value={currentValue.value} onChange={update} />;
      case "Date":
        return <DateValueEditor value={currentValue.value} onChange={update} />;
      case "boolean":
        return <BooleanValueEditor value={currentValue.value} onChange={update} />;
      case "Error":
      case "EvalError":
      case "RangeError":
      case "ReferenceError":
      case "SyntaxError":
      case "TypeError":
      case "URIError":
        return (
          <ErrorValueEditor
            errorType={valueType.value}
            value={currentValue.value}
            onChange={update}
          />
        );
      case "KvU64":
        return <KvU64ValueEditor value={currentValue.value} onChange={update} />;
      case "Map":
        return <MapValueEditor value={currentValue.value} onChange={update} />;
      case "number":
        return <NumberValueEditor value={currentValue.value} onChange={update} />;
      case "object":
        return <ObjectValueEditor value={currentValue.value} onChange={update} />;
      case "RegExp":
        return <RegExpValueEditor value={currentValue.value} onChange={update} />;
      case "Set":
        return <SetValueEditor value={currentValue.value} onChange={update} />;
      case "string":
        return <StringValueEditor value={currentValue.value} onChange={update} />;
      case "null":
        return <StaticValueEditor value="null" />;
      case "undefined":
        return <StaticValueEditor value="undefined" />;
      default:
        return null;
    }
  });

  useSignalEffect(() => {
    if (valueType.value === "null") {
      onChange?.({ type: "null", value: null });
    } else if (valueType.value === "undefined") {
      onChange?.({ type: "undefined" });
    } else {
      onChange?.(currentValue.value);
    }
  });

  const typeSelect = (
    <select
      class="select w-full"
      value={valueType}
      onChange={(evt) => valueType.value = evt.currentTarget.value as KvValueType}
    >
      <option value="string">String</option>
      <option value="number">Number</option>
      <option value="bigint">BigInt</option>
      <option value="boolean">Boolean</option>
      <option value="object">Object</option>
      <option value="Array">Array</option>
      <option value="Map">Map</option>
      <option value="Set">Set</option>
      <option value="RegExp">RegExp</option>
      <option value="KvU64">KvU64</option>
      <option value="Date">Date</option>
      <option value="Error">Error</option>
      <option value="EvalError">EvalError</option>
      <option value="RangeError">RangeError</option>
      <option value="ReferenceError">ReferenceError</option>
      <option value="SyntaxError">SyntaxError</option>
      <option value="TypeError">TypeError</option>
      <option value="URIError">URIError</option>
      <option value="null">Null</option>
      <option value="undefined">Undefined</option>
    </select>
  );

  const deleteButton = onDelete && (
    <button type="button" class="btn btn-sm btn-ghost" onClick={onDelete}>
      <span class="iconify lucide--trash text-error"></span>
    </button>
  );

  if (label) {
    return (
      <div class="border border-base-300 rounded-field bg-base-100 px-3 py-2 flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <span class="label">{label}</span>
          <div class="flex-1">
            {typeSelect}
          </div>
          {deleteButton}
        </div>
        <div>
          {valueEditor}
        </div>
      </div>
    );
  }

  return simpleFlag.value
    ? (
      <div class="flex items-center gap-2">
        <div class="flex-1">
          {typeSelect}
        </div>
        <div class="flex-1 [&>*]:w-full">
          {valueEditor}
        </div>
        {deleteButton}
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
          <div class="flex-1">
            {typeSelect}
          </div>
          {deleteButton}
        </div>
        {expanded.value && (
          <div class="ml-6 mt-2">
            {valueEditor}
          </div>
        )}
      </div>
    );
}
