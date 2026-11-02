import { CloneableErrorTypes } from "@deno/kv-utils/json";
import { SignalLike } from "preact";

import { ArrayValue } from "./ArrayValue.tsx";
import { BigIntValue } from "./BigIntValue.tsx";
import { BooleanValue } from "./BooleanValue.tsx";
import { DateValue } from "./DateValue.tsx";
import { ErrorValue } from "./ErrorValue.tsx";
import { MapValue } from "./MapValue.tsx";
import { NumberValue } from "./NumberValue.tsx";
import { ObjectValue } from "./ObjectValue.tsx";
import { SetValue } from "./SetValue.tsx";
import { StaticValue } from "./StaticValue.tsx";
import { StringValue } from "./StringValue.tsx";
import { RegExpValue } from "./RegExpValue.tsx";

export type CloneableError =
  | Error
  | EvalError
  | RangeError
  | ReferenceError
  | SyntaxError
  | TypeError
  | URIError;

export type Cloneable =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | { [key: string]: Cloneable }
  | Cloneable[]
  | Date
  | RegExp
  | CloneableError
  | Set<Cloneable>
  | Map<Cloneable, Cloneable>;

export type CloneableTypes =
  | "string"
  | "number"
  | "bigint"
  | "boolean"
  | "null"
  | "undefined"
  | "object"
  | "Array"
  | "Date"
  | "RegExp"
  | CloneableErrorTypes
  | "Set"
  | "Map";

function coerce(value: Cloneable, as: "number"): number | "";
function coerce(value: Cloneable, as: "bigint"): bigint | "";
function coerce(value: Cloneable, as: "boolean"): boolean;
function coerce(value: Cloneable, as: "RegExp"): RegExp | "";
function coerce(value: Cloneable, as: "Date"): Date | "";
function coerce(value: Cloneable, as: CloneableErrorTypes): CloneableError;
function coerce(value: Cloneable, as: "Set"): Set<Cloneable>;
function coerce(value: Cloneable, as: "Map"): Map<Cloneable, Cloneable>;
function coerce(value: Cloneable, as: "object"): { [key: string]: Cloneable };
function coerce(value: Cloneable, as: "Array"): Cloneable[];
function coerce(value: Cloneable, as: "undefined"): undefined;
function coerce(value: Cloneable, as: "null"): null;
function coerce(value: Cloneable, as: "string"): string;
function coerce(value: Cloneable, as: CloneableTypes): Cloneable;
function coerce(value: Cloneable, as: CloneableTypes) {
  switch (as) {
    case "number":
      if (typeof value === "number") {
        return value;
      }
      if (typeof value === "bigint") {
        return Number(value);
      }
      if (typeof value === "string") {
        const num = Number(value);
        return isNaN(num) && value !== "NaN" ? "" : value;
      }
      return "";
    case "bigint":
      if (typeof value === "bigint") {
        return value;
      }
      if (typeof value === "number" && Number.isInteger(value)) {
        return BigInt(value);
      }
      if (typeof value === "string" || typeof value === "number") {
        try {
          return BigInt(value);
        } catch {
          return "";
        }
      }
      return "";
    case "boolean":
      if (typeof value === "boolean") {
        return value;
      }
      if (typeof value === "string" && value === "false") {
        return false;
      }
      return !!value;
    case "RegExp":
      if (value instanceof RegExp) {
        return value;
      }
      if (typeof value === "string") {
        try {
          const parts = value.split("/");
          const flags = parts.pop();
          const [, ...pattern] = parts;
          return new RegExp(pattern.join("/"), flags);
        } catch {
          return "";
        }
      }
      return "";
    case "Date":
      if (value instanceof Date) {
        return value;
      }
      if (typeof value === "string") {
        try {
          const date = new Date(value);
          return isNaN(date.getTime()) ? "" : date;
        } catch {
          return "";
        }
      }
      return "";
    case "Error":
    case "EvalError":
    case "RangeError":
    case "ReferenceError":
    case "SyntaxError":
    case "TypeError":
    case "URIError": {
      if (value instanceof Error) {
        if (value.constructor.name === as) {
          return value;
        }
        const err = new globalThis[as](value.message);
        if (value.stack) {
          err.stack = value.stack;
        }
        return err as CloneableError;
      }
      if (typeof value === "string") {
        const err = new globalThis[as](value);
        err.stack = "";
        return err as CloneableError;
      }
      const err = new globalThis[as]("");
      err.stack = "";
      return err as CloneableError;
    }
    case "Set":
      if (value instanceof Set) {
        return value;
      }
      if (Array.isArray(value)) {
        return new Set(value);
      }
      return new Set<Cloneable>();
    case "Map":
      if (value instanceof Map) {
        return value;
      }
      if (Array.isArray(value)) {
        return new Map(value as [Cloneable, Cloneable][]);
      }
      return new Map<Cloneable, Cloneable>();
    case "object":
      if (
        typeof value === "object" && value !== null && !Array.isArray(value) && !(value instanceof Date) &&
        !(value instanceof RegExp)
      ) {
        return value;
      }
      return {};
    case "Array":
      if (Array.isArray(value)) {
        return value;
      }
      return [];
    case "undefined":
      return undefined;
    case "null":
      return null;
    case "string":
      if (value instanceof Date) {
        return `${value.toISOString().slice(0, -5)}Z`;
      }
      return String(value);
    default:
      return String(value);
  }
}

export function getEditorByType(type: CloneableTypes, value: Cloneable, editValue: SignalLike<Cloneable>) {
  switch (type) {
    case "Array":
      editValue.value = coerce(value, "Array");
      return <ArrayValue value={editValue as SignalLike<Cloneable[]>} />;
    case "bigint":
      editValue.value = coerce(value, "bigint");
      return <BigIntValue value={editValue as SignalLike<bigint>} />;
    case "Date":
      editValue.value = coerce(value, "Date");
      return <DateValue value={editValue as SignalLike<Date | string>} />;
    case "boolean":
      editValue.value = coerce(value, "boolean");
      return <BooleanValue value={editValue as SignalLike<boolean>} />;
    case "number":
      editValue.value = coerce(value, "number");
      return <NumberValue value={editValue as SignalLike<number | "">} />;
    case "RegExp":
      editValue.value = coerce(value, "RegExp");
      return <RegExpValue value={editValue as SignalLike<RegExp>} />;
    case "Set":
      editValue.value = coerce(value, "Set");
      return <SetValue value={editValue as SignalLike<Set<Cloneable>>} />;
    case "Map":
      editValue.value = coerce(value, "Map");
      return <MapValue value={editValue as SignalLike<Map<Cloneable, Cloneable>>} />;
    case "object":
      editValue.value = coerce(value, "object");
      return <ObjectValue value={editValue as SignalLike<{ [key: string]: Cloneable }>} />;
    case "Error":
    case "EvalError":
    case "RangeError":
    case "ReferenceError":
    case "SyntaxError":
    case "TypeError":
    case "URIError":
      editValue.value = coerce(value, type);
      return <ErrorValue value={editValue as SignalLike<CloneableError>} />;
    case "string":
      editValue.value = coerce(value, "string");
      return <StringValue value={editValue as SignalLike<string>} />;
    case "null":
    case "undefined":
      return <StaticValue value={type} />;
    default:
      return <div>Unsupported type: {type}</div>;
  }
}

export function isSimpleValueType(type: CloneableTypes) {
  return ["null", "undefined", "number", "boolean", "string", "bigint", "RegExp", "Date"].includes(type);
}

export function valueTypeFromValue(value: Cloneable): CloneableTypes {
  if (value === null) return "null";
  if (Array.isArray(value)) return "Array";
  if (value instanceof Date) return "Date";
  if (value instanceof RegExp) return "RegExp";
  if (value instanceof URIError) return "URIError";
  if (value instanceof TypeError) return "TypeError";
  if (value instanceof SyntaxError) return "SyntaxError";
  if (value instanceof ReferenceError) return "ReferenceError";
  if (value instanceof RangeError) return "RangeError";
  if (value instanceof EvalError) return "EvalError";
  if (value instanceof Error) return "Error";
  if (value instanceof Set) return "Set";
  if (value instanceof Map) return "Map";
  const type = typeof value;
  if (type === "symbol" || type === "function") {
    throw new TypeError(`Unsupported type: ${type}`);
  }
  if (type === "object") return "object";
  return type;
}
