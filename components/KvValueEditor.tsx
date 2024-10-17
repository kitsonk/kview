import { type BlobMeta } from "@kitsonk/kv-toolbox/blob";
import { type KvValueJSON, toValue } from "@kitsonk/kv-toolbox/json";
import { useComputed, useSignal } from "@preact/signals";
import { isBlobMeta, replacer } from "$utils/kv.ts";

import { EditorJson } from "./EditorJson.tsx";

function kvValueJSONToFormData(
  value: KvValueJSON | BlobMeta,
): [type: string, value: string] {
  if (isBlobMeta(value)) {
    switch (value.kind) {
      case "blob":
        return ["Blob", ""];
      case "buffer":
        return ["buffer", ""];
      case "file":
        return ["File", ""];
      default:
        // deno-lint-ignore no-explicit-any
        throw new TypeError(`Unexpected meta kind: "${(value as any).kind}"`);
    }
  } else {
    switch (value.type) {
      case "string":
      case "bigint":
      case "ArrayBuffer":
      case "Int8Array":
      case "Uint8Array":
      case "Uint8ClampedArray":
      case "Int16Array":
      case "Uint16Array":
      case "Int32Array":
      case "Uint32Array":
      case "Float32Array":
      case "Float64Array":
      case "BigInt64Array":
      case "BigUint64Array":
      case "RegExp":
      case "Date":
      case "KvU64":
        return [value.type, value.value];
      case "number":
      case "boolean":
        return [value.type, String(value.value)];
      case "null":
        return [value.type, "null"];
      case "undefined":
        return [value.type, "undefined"];
      case "json_map":
      case "json_set":
        return [
          value.type,
          JSON.stringify(
            [...(toValue(value) as Map<unknown, unknown> | Set<unknown>)],
            replacer,
            "  ",
          ),
        ];
      case "json_array":
      case "json_object":
        return [
          value.type,
          JSON.stringify(toValue(value), replacer, "  "),
        ];
      default:
        throw new TypeError(`Unexpected type: "${value.type}"`);
    }
  }
}

export function KvValueEditor(
  { value }: { value?: KvValueJSON | BlobMeta | undefined },
) {
  const [valueTypeValue, v] = value
    ? kvValueJSONToFormData(value)
    : ["string", undefined];

  const valueType = useSignal(valueTypeValue);
  const valueValue = useSignal(v);
  const valueEditor = useComputed(() => {
    switch (valueType.value) {
      case "number":
        return (
          <input
            id="value"
            name="value"
            type="text"
            pattern="-?\d+(\.\d+)?|-?Infinity|NaN"
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 invalid:border-red-700"
            placeholder="Provide a number"
            required
            onChange={(evt) => valueValue.value = evt.currentTarget.value}
            value={valueValue}
          />
        );
      case "bigint":
      case "KvU64":
        return (
          <input
            id="value"
            name="value"
            type="number"
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 invalid:border-red-700"
            placeholder="Provide a number"
            required
            onChange={(evt) => valueValue.value = evt.currentTarget.value}
            value={valueValue}
          />
        );
      case "boolean":
        return (
          <>
            <input
              id="true"
              name="value"
              type="radio"
              value="true"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              onChange={(evt) => valueValue.value = evt.currentTarget.value}
              checked={valueValue.value === "true"}
            />
            <label
              for="true"
              class="ms-2 px-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              True
            </label>
            <input
              id="false"
              name="value"
              type="radio"
              value="false"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              onChange={(evt) => valueValue.value = evt.currentTarget.value}
              checked={valueValue.value !== "true"}
            />
            <label
              for="false"
              class="ms-2 px-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              False
            </label>
          </>
        );
      case "null":
        return (
          <input
            id="value"
            name="value"
            type="text"
            class="block p-2.5 w-full text-sm text-gray-600 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500"
            value="null"
            readOnly
          />
        );
      case "undefined":
        return (
          <input
            id="value"
            name="value"
            type="text"
            class="block p-2.5 w-full text-sm text-gray-600 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500"
            value="undefined"
            readOnly
          />
        );
      case "RegExp":
        return (
          <input
            id="value"
            name="value"
            type="text"
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 invalid:border-red-700"
            pattern="\/(?![*+?])([^\r\n\[\/\\]|\\.|\[([^\r\n\]\\]|\\.)*\])+/(g(im?|mi?)?|i(gm?|mg?)?|m(gi?|ig?)?)?"
            placeholder="Provide a regular expression"
            value={valueValue}
            onChange={(evt) => valueValue.value = evt.currentTarget.value}
          />
        );
      case "Date":
        return (
          <input
            id="value"
            name="value"
            type="text"
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 invalid:border-red-700"
            pattern="[0-9]{4}-((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01])|(0[469]|11)-(0[1-9]|[12][0-9]|30)|(02)-(0[1-9]|[12][0-9]))T(0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[1-5][0-9]):(0[0-9]|[1-5][0-9])\.[0-9]{3}Z"
            placeholder="Provide an ISO format Date"
            required
            value={valueValue}
            onChange={(evt) => valueValue.value = evt.currentTarget.value}
          />
        );
      case "json_array":
      case "json_object":
        return (
          <div class="max-h-48 overflow-auto max-w-3xl text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 invalid:border-red-700">
            <EditorJson
              id="value"
              name="value"
              placeholder="Provide a value for the entry"
              required
              value={valueValue}
            />
          </div>
        );
      case "buffer":
      case "Blob":
      case "File":
        return (
          <input
            id="file"
            name="file"
            type="file"
            required
            class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          />
        );
      default:
        return (
          <textarea
            id="value"
            name="value"
            rows={4}
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Provide a value for the entry"
            value={valueValue}
            required
            onChange={(evt) => valueValue.value = evt.currentTarget.value}
          >
          </textarea>
        );
    }
  });

  return (
    <>
      <div class="sm:col-span-2">
        <label
          for="value"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Value
        </label>
        {valueEditor}
      </div>
      <div class="sm:col-span-2">
        <label
          for="value_type"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Value Type
        </label>
        <select
          id="value_type"
          name="value_type"
          value={valueType}
          onChange={(evt) => valueType.value = evt.currentTarget.value}
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        >
          <option value="string">String</option>
          <option value="number">Number</option>
          <option value="bigint">BigInt</option>
          <option value="boolean">Boolean</option>
          <option value="json_object">JSON</option>
          <option value="json_array">Array</option>
          <option value="json_map">Map</option>
          <option value="json_set">Set</option>
          <option value="RegExp">RegExp</option>
          <option value="KvU64">KvU64</option>
          <option value="Date">Date</option>
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
      </div>
    </>
  );
}
