import type { KvValueJSON } from "@deno/kv-utils/json";
import type { BlobMeta } from "@kitsonk/kv-toolbox/blob";
import { batch, useComputed, useSignal, useSignalEffect } from "@preact/signals";
import { isBlobMeta } from "@/utils/blobs.ts";

import { ArrayValueEditor } from "./valueEditors/Array.tsx";
import { BigIntValueEditor } from "./valueEditors/BigInt.tsx";
import { BlobValueEditor } from "./valueEditors/Blob.tsx";
import { BooleanValueEditor } from "./valueEditors/Boolean.tsx";
import { DateValueEditor } from "./valueEditors/Date.tsx";
import { ErrorValueEditor } from "./valueEditors/Error.tsx";
import { MapValueEditor } from "./valueEditors/Map.tsx";
import { NumberValueEditor } from "./valueEditors/Number.tsx";
import { KvU64ValueEditor } from "./valueEditors/KvU64.tsx";
import { ObjectValueEditor } from "./valueEditors/Object.tsx";
import { RegExpValueEditor } from "./valueEditors/RegExp.tsx";
import { SetValueEditor } from "./valueEditors/Set.tsx";
import { StaticValueEditor } from "./valueEditors/Static.tsx";
import { StringValueEditor } from "./valueEditors/String.tsx";

export type KvValueTypes = KvValueJSON["type"] | "buffer" | "Blob" | "File";

export function getKvValueType(value: KvValueJSON | BlobMeta): KvValueTypes {
  if (isBlobMeta(value)) {
    if (value.kind === "file") {
      return "File";
    }
    if (value.kind === "blob") {
      return "Blob";
    }
    return "buffer";
  }
  return value.type;
}

export function KvValueEditor(
  { value, onChange }: {
    value?: KvValueJSON | BlobMeta;
    onChange?: (type: KvValueTypes, value?: KvValueJSON, file?: File) => void;
  },
) {
  const valueType = useSignal<KvValueTypes>(value ? getKvValueType(value) : "string");
  const currentValue = useSignal(isBlobMeta(value) ? undefined : value);
  const currentFile = useSignal<File | undefined>(undefined);
  const currentMeta = useSignal(isBlobMeta(value) ? value : undefined);

  const onChangeValue = (value?: KvValueJSON) => currentValue.value = value;

  const valueEditor = useComputed(() => {
    switch (valueType.value) {
      case "Array":
        return <ArrayValueEditor value={currentValue.value} onChange={onChangeValue} />;
      case "buffer":
      case "Blob":
      case "File":
        return (
          <BlobValueEditor
            meta={currentMeta}
            onChange={(file) =>
              batch(() => {
                currentValue.value = undefined;
                currentFile.value = file;
              })}
          />
        );
      case "boolean":
        return <BooleanValueEditor value={currentValue.value} onChange={onChangeValue} />;
      case "bigint":
        return <BigIntValueEditor value={currentValue.value} onChange={onChangeValue} />;
      case "Date":
        return <DateValueEditor value={currentValue.value} onChange={onChangeValue} />;
      case "Error":
      case "EvalError":
      case "RangeError":
      case "ReferenceError":
      case "SyntaxError":
      case "TypeError":
      case "URIError":
        return <ErrorValueEditor errorType={valueType.value} value={currentValue.value} onChange={onChangeValue} />;
      case "KvU64":
        return <KvU64ValueEditor value={currentValue.value} onChange={onChangeValue} />;
      case "null":
        currentValue.value = { type: "null", value: null };
        return <StaticValueEditor value="null" />;
      case "number":
        return <NumberValueEditor value={currentValue.value} onChange={onChangeValue} />;
      case "object":
        return <ObjectValueEditor value={currentValue.value} onChange={onChangeValue} />;
      case "RegExp":
        return <RegExpValueEditor value={currentValue.value} onChange={onChangeValue} />;
      case "Map":
        return <MapValueEditor value={currentValue.value} onChange={onChangeValue} />;
      case "Set":
        return <SetValueEditor value={currentValue.value} onChange={onChangeValue} />;
      case "undefined":
        currentValue.value = { type: "undefined" };
        return <StaticValueEditor value="undefined" />;
      default:
        return <StringValueEditor value={currentValue.value} onChange={onChangeValue} />;
    }
  });
  useSignalEffect(() => onChange?.(valueType.value, currentValue.value, currentFile.value));
  return (
    <fieldset class="fieldset">
      <label for="valueType" class="label">Value Type</label>
      <select
        id="valueType"
        class="select w-full"
        value={valueType}
        onChange={(evt) => valueType.value = evt.currentTarget.value as KvValueTypes}
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
        <option value="buffer">Binary Data</option>
        <option value="Blob">Blob</option>
        <option value="File">File</option>
        <option value="ArrayBuffer">ArrayBuffer</option>
        <option value="Int8Array">Int8Array</option>
        <option value="Uint8Array">Uint8Array</option>
        <option value="Uint8ClampedArray">Uint8ClampedArray</option>
        <option value="Int16Array">Int16Array</option>
        <option value="Uint16Array">Uint16Array</option>
        <option value="Int32Array">Int32Array</option>
        <option value="Uint32Array">Uint32Array</option>
        <option value="Float32Array">Float32Array</option>
        <option value="Float64Array">Float64Array</option>
        <option value="BigInt64Array">BigInt64Array</option>
        <option value="BigUint64Array">BigUint64Array</option>
        <option value="DataView">DataView</option>
        <option value="null">Null</option>
        <option value="undefined">Undefined</option>
      </select>
      <label for="value" class="label">Value</label>
      {valueEditor}
    </fieldset>
  );
}
