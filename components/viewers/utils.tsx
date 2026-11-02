import type { KvValueJSON } from "@deno/kv-utils/json";

const COMPLEX_TYPES = new Set([
  "Array",
  "Map",
  "Set",
  "object",
]);

export function isComplexType(type: KvValueJSON["type"]): boolean {
  return COMPLEX_TYPES.has(type);
}

export function isPrimitiveType(type: KvValueJSON["type"]): boolean {
  return !isComplexType(type);
}

export const rootClasses = "bg-base-100 border-base-300 rounded-field border overflow-x-auto max-h-96 p-3 w-full";

export const childContainerClasses = "ml-2 border-l border-base-300 pl-2 space-y-2 mt-2";

export const keyClasses = "font-mono text-sm text-base-content/80 shrink-0 truncate max-w-[12rem]";

export const indexClasses = "text-xs px-1 text-base-content/60 font-mono shrink-0";

const BADGE_BASE = "badge badge-soft badge-sm font-mono text-xs shrink-0";

const TYPE_BADGE_COLOR: Record<KvValueJSON["type"], string> = {
  Array: "badge-secondary",
  Map: "badge-warning",
  Set: "badge-warning",
  object: "badge-secondary",
  string: "badge-primary",
  number: "badge-secondary",
  bigint: "badge-info",
  boolean: "badge-warning",
  null: "badge-neutral",
  undefined: "badge-neutral",
  Date: "badge-warning",
  RegExp: "badge-warning",
  KvU64: "badge-info",
  ArrayBuffer: "badge-accent",
  DataView: "badge-accent",
  Int8Array: "badge-accent",
  Uint8Array: "badge-accent",
  Uint8ClampedArray: "badge-accent",
  Int16Array: "badge-accent",
  Uint16Array: "badge-accent",
  Int32Array: "badge-accent",
  Uint32Array: "badge-accent",
  Float32Array: "badge-accent",
  Float64Array: "badge-accent",
  BigInt64Array: "badge-accent",
  BigUint64Array: "badge-accent",
  Error: "badge-error",
  EvalError: "badge-error",
  RangeError: "badge-error",
  ReferenceError: "badge-error",
  SyntaxError: "badge-error",
  TypeError: "badge-error",
  URIError: "badge-error",
};

export function typeBadgeClasses(type: KvValueJSON["type"]): string {
  return `${BADGE_BASE} ${TYPE_BADGE_COLOR[type] ?? "badge-ghost"}`;
}

const TYPE_LABEL: Record<KvValueJSON["type"], string> = {
  bigint: "BigInt",
  boolean: "Boolean",
  number: "Number",
  string: "String",
  null: "Null",
  undefined: "Undefined",
  Array: "Array",
  object: "Object",
  Map: "Map",
  Set: "Set",
  Date: "Date",
  RegExp: "RegExp",
  KvU64: "Deno.KvU64",
  ArrayBuffer: "ArrayBuffer",
  DataView: "DataView",
  Int8Array: "Int8Array",
  Uint8Array: "Uint8Array",
  Uint8ClampedArray: "Uint8ClampedArray",
  Int16Array: "Int16Array",
  Uint16Array: "Uint16Array",
  Int32Array: "Int32Array",
  Uint32Array: "Uint32Array",
  Float32Array: "Float32Array",
  Float64Array: "Float64Array",
  BigInt64Array: "BigInt64Array",
  BigUint64Array: "BigUint64Array",
  Error: "Error",
  EvalError: "EvalError",
  RangeError: "RangeError",
  ReferenceError: "ReferenceError",
  SyntaxError: "SyntaxError",
  TypeError: "TypeError",
  URIError: "URIError",
};

export function formatTypeLabel(type: KvValueJSON["type"]): string {
  return TYPE_LABEL[type] ?? type;
}
