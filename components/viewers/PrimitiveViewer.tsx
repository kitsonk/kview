import type { KvValueJSON } from "@deno/kv-utils/json";
import type { ComponentChildren } from "preact";

import { formatTypeLabel, typeBadgeClasses } from "./utils.tsx";

function Badge({ type }: { type: KvValueJSON["type"] }) {
  return <span class={typeBadgeClasses(type)}>{formatTypeLabel(type)}</span>;
}

function PlainString({ value }: { value: string }) {
  if (value === "") {
    return <span class="text-base-content/40 italic font-mono text-sm">""</span>;
  }
  return <span class="font-mono text-sm break-all">"{value}"</span>;
}

function PlainNumber({ value }: { value: number | "Infinity" | "-Infinity" | "NaN" }) {
  if (value === "NaN") {
    return <span class="font-mono text-sm">NaN</span>;
  }
  if (value === "Infinity") {
    return <span class="font-mono text-sm">Infinity</span>;
  }
  if (value === "-Infinity") {
    return <span class="font-mono text-sm">-Infinity</span>;
  }
  return <span class="font-mono text-sm">{String(value)}</span>;
}

function PlainBoolean({ value }: { value: boolean }) {
  return <span class="font-mono text-sm">{value ? "true" : "false"}</span>;
}

function PlainNull() {
  return <span class="font-mono text-sm text-base-content/50 italic">null</span>;
}

function PlainUndefined() {
  return <span class="font-mono text-sm text-base-content/50 italic">undefined</span>;
}

function PlainBigInt({ value }: { value: string }) {
  return <span class="font-mono text-sm">{value}n</span>;
}

function PlainDate({ value }: { value: string }) {
  return <span class="font-mono text-sm">{value}</span>;
}

function PlainRegExp({ value }: { value: string }) {
  return <span class="font-mono text-sm">/{value}/</span>;
}

function PlainKvU64({ value }: { value: string }) {
  return <span class="font-mono text-sm">{value}n</span>;
}

function PlainBinary({ type, byteLength }: { type: string; byteLength: number }) {
  return <span class="font-mono text-sm">{type}[{byteLength} bytes]</span>;
}

function PlainError({ type, message }: { type: string; message: string }) {
  return (
    <span class="font-mono text-sm">
      <span class="text-base-content/70">{type}:</span> {message}
    </span>
  );
}

export function PrimitiveViewer({ value, noBadge = false }: { value: KvValueJSON; noBadge?: boolean }) {
  const wrap = (type: KvValueJSON["type"], plain: ComponentChildren) =>
    noBadge ? <>{plain}</> : (
      <span class="inline-flex items-center gap-2">
        <Badge type={type} />
        {plain}
      </span>
    );
  switch (value.type) {
    case "string":
      return <PlainString value={value.value} />;
    case "number":
      return <PlainNumber value={value.value} />;
    case "boolean":
      return <PlainBoolean value={value.value} />;
    case "null":
      return <PlainNull />;
    case "undefined":
      return <PlainUndefined />;
    case "bigint":
      return wrap("bigint", <PlainBigInt value={value.value} />);
    case "Date":
      return wrap("Date", <PlainDate value={value.value} />);
    case "RegExp":
      return wrap("RegExp", <PlainRegExp value={value.value} />);
    case "KvU64":
      return wrap("KvU64", <PlainKvU64 value={value.value} />);
    case "Error":
    case "EvalError":
    case "RangeError":
    case "ReferenceError":
    case "SyntaxError":
    case "TypeError":
    case "URIError":
      return wrap(value.type, <PlainError type={value.type} message={value.value.message} />);
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
      return wrap(value.type, <PlainBinary type={value.type} byteLength={value.byteLength} />);
    default:
      return <span class="font-mono text-sm text-base-content/50 italic">[{value.type}]</span>;
  }
}
