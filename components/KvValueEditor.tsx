import { useComputed, useSignal } from "@preact/signals";
import { KvValueJSON } from "$utils/kv.ts";

import { EditorJson } from "./EditorJson.tsx";

function kvValueJSONToFormData(
  value: KvValueJSON,
): [type: string, value: string] {
  switch (value.type) {
    case "string":
    case "bigint":
    case "Uint8Array":
    case "RegExp":
    case "KvU64":
      return [value.type, value.value];
    case "number":
    case "boolean":
      return [value.type, String(value.value)];
    case "null":
      return [value.type, "null"];
    case "Map":
    case "Set":
    case "object":
      return [value.type, JSON.stringify(value.value, undefined, "  ")];
    default:
      throw new TypeError(`Unexpected type: "${value.type}"`);
  }
}

export function KvValueEditor({ value }: { value?: KvValueJSON | undefined }) {
  const [valueTypeValue, v] = value
    ? kvValueJSONToFormData(value)
    : ["string", undefined];

  const valueType = useSignal(valueTypeValue);
  const valueValue = useSignal(v);
  const valueEditor = useComputed(() => {
    switch (valueType.value) {
      case "number":
      case "bigint":
      case "KvU64":
        return (
          <input
            id="value"
            name="value"
            type="number"
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Provide a number"
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
      case "RegExp":
        return (
          <input
            id="value"
            name="value"
            type="text"
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            pattern="\/(?![*+?])([^\r\n\[\/\\]|\\.|\[([^\r\n\]\\]|\\.)*\])+/(g(im?|mi?)?|i(gm?|mg?)?|m(gi?|ig?)?)?"
            placeholder="Provide a regular expression"
            value={valueValue}
            onChange={(evt) => valueValue.value = evt.currentTarget.value}
          />
        );
      case "object":
        return (
          <EditorJson
            id="value"
            name="value"
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Provide a value for the entry"
            value={valueValue}
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
          <option value="null">Null</option>
          <option value="boolean">Boolean</option>
          <option value="object">JSON</option>
          <option value="Uint8Array">Uint8Array</option>
          <option value="Map">Map</option>
          <option value="Set">Set</option>
          <option value="RegExp">RegExp</option>
          <option value="KvU64">KvU64</option>
        </select>
      </div>
    </>
  );
}
