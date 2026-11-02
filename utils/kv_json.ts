import type {
  KvBigIntJSON,
  KvBooleanJSON,
  KvDateJSON,
  KvKvU64JSON,
  KvNumberJSON,
  KvRegExpJSON,
  KvStringJSON,
  KvValueJSON,
} from "@deno/kv-utils/json";

function decodeObject(json: { [key: string]: KvValueJSON }): string {
  let result = "{";
  for (const [key, value] of Object.entries(json)) {
    result += `"${key}":${stringify(value)},`;
  }
  if (result.endsWith(",")) {
    result = result.slice(0, -1);
  }
  result += "}";
  return result;
}

export function stringify(json: KvValueJSON): string {
  switch (json.type) {
    case "Array":
      return `[${json.value.map(stringify).join(",")}]`;
    case "Map":
      return `"Map(${json.value.length})"`;
    case "object":
      return decodeObject(json.value);
    case "Set":
      return `"Set(${json.value.length})"`;
    case "null":
      return `null`;
    case "ArrayBuffer":
    case "BigInt64Array":
    case "BigUint64Array":
    case "Float32Array":
    case "Float64Array":
    case "Int16Array":
    case "Int32Array":
    case "Int8Array":
    case "Uint16Array":
    case "Uint32Array":
    case "Uint8Array":
    case "Uint8ClampedArray":
    case "DataView":
      return `"${json.type}[${json.byteLength} bytes]"`;
    case "Date":
      return `"Date(${json.value})"`;
    case "Error":
    case "EvalError":
    case "RangeError":
    case "ReferenceError":
    case "SyntaxError":
    case "TypeError":
    case "URIError":
      return `"${json.type}('${json.value.message}')"`;
    case "KvU64":
      return `"Deno.KvU64(${json.value}n)"`;
    case "RegExp": {
      return `"RegExp(${json.value})"`;
    }
    case "bigint":
      return `"BigInt {${json.value.toString()}}"`;
    case "boolean":
      return json.value ? "true" : "false";
    case "number":
    case "string":
      return JSON.stringify(json.value);
    case "undefined":
      return `"{undefined}"`;
    default:
      // deno-lint-ignore no-explicit-any
      throw new TypeError(`Unexpected value type: "${(json as any).type}"`);
  }
}

export function toFormString(value?: KvValueJSON): string {
  if (value) {
    switch (value.type) {
      case "string":
      case "bigint":
      case "Date":
      case "KvU64":
      case "RegExp":
        return value.value;
      case "number":
        return String(value.value);
      case "boolean":
        return value.value ? "true" : "false";
    }
  }
  return "";
}

export function toErrorParts(
  value?: KvValueJSON,
): { message: string; stack?: string | undefined; cause?: KvValueJSON | undefined } {
  if (
    value &&
    (value.type === "Error" || value.type === "EvalError" || value.type === "RangeError" ||
      value.type === "ReferenceError" || value.type === "SyntaxError" || value.type === "TypeError" ||
      value.type === "URIError")
  ) {
    return {
      message: value.value.message,
      stack: value.value.stack,
      cause: value.value.cause,
    };
  }
  return {
    message: "",
  };
}

export function toKvBigIntJSON(value: string): KvBigIntJSON {
  try {
    return { type: "bigint", value: String(BigInt(value)) };
  } catch {
    return { type: "bigint", value: "0" };
  }
}

export function toKvBooleanJSON(value: boolean): KvBooleanJSON {
  return { type: "boolean", value };
}

export function toKvDateJSON(value: string): KvDateJSON {
  const timestamp = Date.parse(value);
  if (isNaN(timestamp)) {
    return { type: "Date", value: new Date().toISOString() };
  }
  return { type: "Date", value: new Date(timestamp).toISOString() };
}

export function toKvKvU64JSON(value: string): KvKvU64JSON {
  try {
    const bigintValue = BigInt(value);
    if (bigintValue < 0n) {
      return { type: "KvU64", value: "0" };
    }
    return { type: "KvU64", value: String(bigintValue) };
  } catch {
    return { type: "KvU64", value: "0" };
  }
}

export function toKvNumberJSON(value: string): KvNumberJSON {
  const parsed = Number(value);
  return {
    type: "number",
    value: Number.isNaN(parsed)
      ? value === "NaN" ? "NaN" : 0
      : parsed === Infinity
      ? "Infinity"
      : parsed === -Infinity
      ? "-Infinity"
      : parsed,
  };
}

export function toKvRegExpJSON(value: string): KvRegExpJSON {
  return { type: "RegExp", value };
}

export function toKvStringJSON(value: string): KvStringJSON {
  return { type: "string", value };
}
