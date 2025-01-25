import {
  type KvStringJSON,
  type KvValueJSON,
  toValue,
  valueToJSON,
} from "@deno/kv-utils/json";
import type {
  Kinds,
  KvFilterAndJSON,
  KvFilterJSON,
  KvFilterOrJSON,
  Operation,
} from "@kitsonk/kv-toolbox/query";
import type { ComponentChildren } from "preact";
import { useSignal } from "@preact/signals";
import { assert } from "@std/assert/assert";
import { formDataToKvKeyPartJSON, getByteLength } from "$utils/formData.ts";
import { replacer } from "$utils/kv.ts";

import { KvSimpleValueEditor } from "./KvSimpleValueEditor.tsx";
import IconPlus from "./icons/Plus.tsx";
import IconTrashcan from "./icons/Trashcan.tsx";

export interface KvFilterIndeterminateJSON {
  kind: "";
}

const KIND_STR = [
  "bigint",
  "boolean",
  "number",
  "string",
  "undefined",
  "null",
  "object",
  "Array",
  "Map",
  "Set",
  "RegExp",
  "Date",
  "KvU64",
  "ArrayBuffer",
  "DataView",
  "Int8Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Int16Array",
  "Uint16Array",
  "Int32Array",
  "Uint32Array",
  "Float32Array",
  "Float64Array",
  "BigInt64Array",
  "BigUint64Array",
  "Error",
  "EvalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError",
];

function formDataToKvValueJSON(
  type: string,
  value: string,
): KvValueJSON {
  switch (type) {
    case "string":
    case "number":
    case "bigint":
    case "boolean":
    case "Uint8Array":
      return formDataToKvKeyPartJSON(type, value);
    case "null":
      return { type, value: null };
    case "undefined":
      return { type };
    case "Map": {
      const parsedValue = JSON.parse(value);
      return valueToJSON(
        new Map(Array.isArray(parsedValue) ? parsedValue : []),
      );
    }
    case "Set": {
      const parsedValue = JSON.parse(value);
      return valueToJSON(
        new Set(Array.isArray(parsedValue) ? parsedValue : []),
      );
    }
    case "Array": {
      const parsedValue = JSON.parse(value);
      return {
        type,
        value: Array.isArray(parsedValue) ? parsedValue.map(valueToJSON) : [],
      };
    }
    case "object": {
      const parsedValue = JSON.parse(value);
      let v: Record<string, KvValueJSON> = {};
      if (typeof parsedValue === "object" && parsedValue !== null) {
        v = Object.fromEntries(
          Object.entries(parsedValue)
            .map(([key, value]) => [key, valueToJSON(value)]),
        );
      }
      return { type, value: v };
    }
    case "RegExp":
    case "Date":
    case "KvU64":
      return { type, value };
    case "ArrayBuffer":
    case "Int8Array":
    case "Uint8ClampedArray":
    case "Int16Array":
    case "Uint16Array":
    case "Int32Array":
    case "Uint32Array":
    case "Float32Array":
    case "Float64Array":
    case "BigInt64Array":
    case "BigUint64Array":
    case "DataView":
      return { type, value, byteLength: getByteLength(value) };
    default:
      throw new TypeError(`Unexpected type: "${type}"`);
  }
}

function kvValueJSONToFromData(
  value?: KvValueJSON,
): [type: Kinds, value: string] {
  if (!value) {
    return ["string", ""];
  }
  switch (value.type) {
    case "string":
    case "bigint":
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
    case "Map":
    case "Set":
      return [
        value.type,
        JSON.stringify(
          [...toValue(value) as Map<unknown, unknown> | Set<unknown>],
          replacer,
        ),
      ];
    case "Array":
    case "object":
      return [value.type, JSON.stringify(toValue(value), replacer)];
    default:
      return ["string", ""];
  }
}

function SubFilters(
  { index, filter, onChange }: {
    index: number;
    filter: KvFilterAndJSON | KvFilterOrJSON;
    onChange: (index: number, value: KvFilterJSON) => void;
  },
) {
  const localFilters = filter.filters.length
    ? useSignal<(KvFilterJSON | KvFilterIndeterminateJSON)[]>(filter.filters)
    : useSignal<(KvFilterJSON | KvFilterIndeterminateJSON)[]>([{ kind: "" }]);
  const handleFilterOnChange = (localIndex: number, value: KvFilterJSON) => {
    localFilters.value = localFilters.value.map((filter, i) =>
      i === localIndex ? value : filter
    );
    onChange(index, {
      kind: filter.kind,
      filters: [...localFilters.peek() as KvFilterJSON[]],
    });
  };
  const handleFilterOnRemove = (localIndex: number) => {
    localFilters.value = localFilters.value.filter((_, i) => i !== localIndex);
    onChange(index, {
      kind: filter.kind,
      filters: [...localFilters.peek() as KvFilterJSON[]],
    });
  };
  const handleAddOnClick = () => {
    localFilters.value = [...localFilters.value, { kind: "" }];
    onChange(index, {
      kind: filter.kind,
      filters: [...localFilters.peek() as KvFilterJSON[]],
    });
  };
  const filterComponents = localFilters.value.map((filter, localIndex) => (
    <QueryFilter
      key={`${index}-${localIndex}`}
      index={localIndex}
      id={`${index}-${localIndex}`}
      filter={filter}
      onChange={handleFilterOnChange}
      onRemove={handleFilterOnRemove}
    />
  ));
  return (
    <div class="pl-2 border-l dark:border-gray-600 space-y-3">
      {filterComponents}
      <a
        href="#"
        class="flex items-center pb-2 text-sm font-medium text-primary-600 dark:text-primary-500 hover:underline"
        onClick={handleAddOnClick}
      >
        <IconPlus />
        Add Condition
      </a>
    </div>
  );
}

export function QueryFilter(
  { filter, index, id, onChange, onRemove }: {
    filter: KvFilterJSON | KvFilterIndeterminateJSON;
    index: number;
    id: string;
    onChange: (index: number, value: KvFilterJSON) => void;
    onRemove: (index: number) => void;
  },
) {
  const handleKindOnChange = (event: Event) => {
    switch ((event.target as HTMLSelectElement).value) {
      case "where":
        onChange(index, {
          kind: "where",
          property: "",
          operation: "==",
          value: { type: "string", value: "" },
        });
        break;
      case "value":
        onChange(index, {
          kind: "value",
          operation: "==",
          value: { type: "string", value: "" },
        });
        break;
      case "and":
        onChange(index, { kind: "and", filters: [] });
        break;
      case "or":
        onChange(index, { kind: "or", filters: [] });
        break;
    }
  };
  const handleOperationOnChange = (event: Event) => {
    if (filter.kind === "where" || filter.kind === "value") {
      const operation = (event.target as HTMLSelectElement).value as Operation;
      let value = filter.value;
      if (
        operation === "in" || operation === "not-in" ||
        operation === "array-contains-any"
      ) {
        value = { type: "Array", value: [] };
      } else if (operation === "matches") {
        value = { type: "RegExp", value: "" };
      } else if (operation === "kind-of") {
        value = { type: "string", value: "" };
      }
      onChange(index, { ...filter, operation, value });
    }
  };
  let valueEditor: ComponentChildren = <div class="block">&nbsp;</div>;
  if (filter.kind === "where" || filter.kind === "value") {
    let only: Kinds[] | undefined;
    if (
      filter.operation === "in" || filter.operation === "not-in" ||
      filter.operation === "array-contains-any"
    ) {
      only = ["Array"];
    } else if (filter.operation === "matches") {
      only = ["RegExp"];
    }
    const [type, value] = kvValueJSONToFromData(filter.value);
    const handleValueChange = (type: string, v: string) => {
      try {
        const value = formDataToKvValueJSON(type, v);
        onChange(index, {
          ...filter,
          value,
        });
      } catch (error) {
        console.error(error);
      }
    };
    valueEditor = filter.operation !== "kind-of"
      ? (
        <KvSimpleValueEditor
          id={id}
          type={type}
          value={value}
          only={only}
          onChange={handleValueChange}
        />
      )
      : (
        <select
          id={`value_type-${id}`}
          name={`value_type-${id}`}
          class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          onChange={(event) => {
            const value = event.currentTarget.value;
            onChange(index, {
              ...filter,
              value: { type: "string", value },
            });
          }}
        >
          <option
            value=""
            selected={!(filter.value as KvStringJSON).value}
            disabled
          >
            Kind
          </option>
          {KIND_STR.map((kind) => {
            assert(filter.value.type === "string");
            return (
              <option selected={filter.value.value === kind}>
                {kind}
              </option>
            );
          })}
        </select>
      );
  }
  return (
    <>
      <div class="flex items-center space-x-3 rounded-lg">
        <div class="grid w-full grid-cols-2 gap-2 md:gap-3 md:grid-cols-5">
          <select
            id={`kind-${id}`}
            class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            onChange={handleKindOnChange}
          >
            <option value="" selected={filter.kind === ""} disabled>
              Kind
            </option>
            <option selected={filter.kind === "where"}>where</option>
            <option selected={filter.kind === "value"}>value</option>
            <option selected={filter.kind === "and"}>and</option>
            <option selected={filter.kind === "or"}>or</option>
          </select>

          {filter.kind === "where"
            ? (
              <input
                type="text"
                id={`property-${id}`}
                placeholder="Property"
                required
                class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                value={Array.isArray(filter.property)
                  ? filter.property.join(".")
                  : filter.property}
                onChange={(event) => {
                  const property = event.currentTarget.value;
                  onChange(index, {
                    ...filter,
                    property: property.includes(".")
                      ? property.split(".")
                      : property,
                  });
                }}
              />
            )
            : <div class="block w-full">&nbsp;</div>}

          {filter.kind === "where" || filter.kind === "value"
            ? (
              <select
                id={`operator-${id}`}
                class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                onChange={handleOperationOnChange}
              >
                <option value="" selected={!filter.operation} disabled>
                  Operator
                </option>
                <option value="<" selected={filter.operation === "<"}>
                  &lt;
                </option>
                <option value="<=" selected={filter.operation === "<="}>
                  &lt;=
                </option>
                <option value="==" selected={filter.operation === "=="}>
                  ==
                </option>
                <option value="!=" selected={filter.operation === "!="}>
                  !=
                </option>
                <option value=">=" selected={filter.operation === ">="}>
                  &gt;=
                </option>
                <option value=">" selected={filter.operation === ">"}>
                  &gt;
                </option>
                <option
                  value="array-contains"
                  selected={filter.operation === "array-contains"}
                >
                  contains
                </option>
                <option
                  value="array-contains-any"
                  selected={filter.operation === "array-contains-any"}
                >
                  contains any
                </option>
                <option value="in" selected={filter.operation === "in"}>
                  in
                </option>
                <option value="not-in" selected={filter.operation === "not-in"}>
                  not in
                </option>
                <option
                  value="matches"
                  selected={filter.operation === "matches"}
                >
                  matches
                </option>
                <option
                  value="kind-of"
                  selected={filter.operation === "kind-of"}
                >
                  kind of
                </option>
              </select>
            )
            : <div class="block min-w-56">&nbsp;</div>}
          {valueEditor}
        </div>
        <button
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={() => onRemove(index)}
        >
          <IconTrashcan />
          <span class="sr-only">Delete</span>
        </button>
      </div>
      {filter.kind === "and" || filter.kind === "or"
        ? <SubFilters index={index} filter={filter} onChange={onChange} />
        : undefined}
    </>
  );
}
