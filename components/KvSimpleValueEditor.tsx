import type { Kinds } from "@kitsonk/kv-toolbox/query";

const TYPE_OPTIONS: [Kinds, string][] = [
  ["string", "String"],
  ["number", "Number"],
  ["bigint", "BigInt"],
  ["boolean", "Boolean"],
  ["undefined", "Undefined"],
  ["null", "Null"],
  ["Array", "Array"],
  ["Map", "Map"],
  ["Set", "Set"],
  ["object", "JSON"],
  ["RegExp", "RegExp"],
  ["Date", "Date"],
  ["KvU64", "KvU64"],
  ["ArrayBuffer", "ArrayBuffer"],
  ["DataView", "DataView"],
  ["Int8Array", "Int8Array"],
  ["Uint8Array", "Uint8Array"],
  ["Uint8ClampedArray", "Uint8ClampedArray"],
  ["Int16Array", "Int16Array"],
  ["Uint16Array", "Uint16Array"],
  ["Int32Array", "Int32Array"],
  ["Uint32Array", "Uint32Array"],
  ["Float32Array", "Float32Array"],
  ["Float64Array", "Float64Array"],
  ["BigInt64Array", "BigInt64Array"],
  ["BigUint64Array", "BigUint64Array"],
];

function Editor(
  { id, type, value, onChange }: {
    id: string;
    type: string;
    value: string;
    onChange: (event: Event) => void;
  },
) {
  switch (type) {
    case "number":
      return (
        <input
          id={`value-${id}`}
          name={`value-${id}`}
          type="text"
          class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 invalid:border-red-700"
          pattern="-?\d+(\.\d+)?|-?Infinity|NaN"
          placeholder="Number"
          required
          onChange={onChange}
          value={value}
        />
      );
    case "bigint":
    case "KvU64":
      return (
        <input
          id={`value-${id}`}
          name={`value-${id}`}
          type="number"
          class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 invalid:border-red-700"
          placeholder="Number"
          required
          onChange={onChange}
          value={value}
        />
      );
    case "boolean":
      return (
        <select
          id={`value-${id}`}
          name={`value-${id}`}
          class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          onChange={onChange}
          value={value}
        >
          <option>true</option>
          <option>false</option>
        </select>
      );
    case "null":
    case "undefined":
      return (
        <input
          id={`value-${id}`}
          name={`value-${id}`}
          type="text"
          class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          value={type === "null" ? "null" : "undefined"}
          readOnly
        />
      );
    case "RegExp":
      return (
        <input
          id={`value-${id}`}
          name={`value-${id}`}
          type="text"
          class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 invalid:border-red-700"
          pattern="\/(?![*+?])([^\r\n\[\/\\]|\\.|\[([^\r\n\]\\]|\\.)*\])+/(g(im?|mi?)?|i(gm?|mg?)?|m(gi?|ig?)?)?"
          placeholder="RegExp"
          required
          onChange={onChange}
          value={value}
        />
      );
    case "Date":
      return (
        <input
          id={`value-${id}`}
          name={`value-${id}`}
          type="text"
          class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 invalid:border-red-700"
          pattern="[0-9]{4}-((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01])|(0[469]|11)-(0[1-9]|[12][0-9]|30)|(02)-(0[1-9]|[12][0-9]))T(0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[1-5][0-9]):(0[0-9]|[1-5][0-9])\.[0-9]{3}Z"
          placeholder="Date"
          required
          onChange={onChange}
          value={value}
        />
      );
    case "ArrayBuffer":
    case "DataView":
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
      return (
        <input
          id={`value-${id}`}
          name={`value-${id}`}
          type="text"
          class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 invalid:border-red-700"
          pattern="[-A-Za-z0-9+/]*={0,3}"
          placeholder="Base64"
          required
          onChange={onChange}
          value={value}
        />
      );
    default:
      return (
        <input
          id={`value-${id}`}
          name={`value-${id}`}
          type="text"
          class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          placeholder="Value"
          required
          onChange={onChange}
          value={value}
        />
      );
  }
}

export function KvSimpleValueEditor(
  { type, id, value, only, onChange }: {
    type: Kinds;
    id: string;
    value: string;
    only?: Kinds[] | undefined;
    onChange: (type: Kinds, value: string) => void;
  },
) {
  const handleValueOnChange = (event: Event) => {
    onChange(type, (event.currentTarget as HTMLInputElement).value);
  };

  return (
    <>
      <select
        id={`value_type-${id}`}
        name={`value_type-${id}`}
        value={type}
        class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        onChange={(evt) => onChange(evt.currentTarget.value as Kinds, value)}
      >
        {TYPE_OPTIONS
          .filter(([type]) => only ? only.includes(type) : true)
          .map(([type, label]) => <option value={type}>{label}</option>)}
      </select>
      <Editor
        id={id}
        type={type}
        value={value}
        onChange={handleValueOnChange}
      />
    </>
  );
}
