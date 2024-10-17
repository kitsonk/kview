import { useComputed, useSignal } from "@preact/signals";

import { Label } from "./Label.tsx";

export function KvKeyPartEditor() {
  const keyPartType = useSignal("string");
  const keyPartEditor = useComputed(() => {
    switch (keyPartType.value) {
      case "bigint":
        return (
          <input
            type="number"
            name="key_part"
            id="key_part"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 invalid:border-red-700"
            placeholder="Key part value"
            required
          />
        );
      case "number":
        return (
          <input
            type="text"
            name="key_part"
            id="key_part"
            pattern="-?\d+(\.\d+)?|-?Infinity|NaN"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 invalid:border-red-700"
            placeholder="Key part value"
            required
          />
        );
      case "boolean":
        return (
          <select
            name="key_part"
            id="key_part"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          >
            <option selected value="true">true</option>
            <option value="false">false</option>
          </select>
        );
      default:
        return (
          <input
            type="text"
            name="key_part"
            id="key_part"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Key part value"
            required
          />
        );
    }
  });

  return (
    <>
      <div>
        <Label for="key_part">Key Part</Label>
        {keyPartEditor}
      </div>
      <div>
        <Label for="key_part_type">Key Part Type</Label>
        <select
          id="key_part_type"
          name="key_part_type"
          value={keyPartType}
          onChange={(evt) => keyPartType.value = evt.currentTarget.value}
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        >
          <option selected value="string">String</option>
          <option value="number">Number</option>
          <option value="bigint">BigInt</option>
          <option value="boolean">Boolean</option>
          <option value="Uint8Array">Uint8Array</option>
        </select>
      </div>
    </>
  );
}
