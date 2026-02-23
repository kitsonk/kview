import type { KvEntryJSON, KvEntryMaybeJSON, KvValueJSON } from "@deno/kv-utils";

export function isEntryJSON(value: KvEntryMaybeJSON): value is KvEntryJSON {
  return value.versionstamp !== null;
}

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
      const parts = json.value.split("/");
      const flags = parts.pop();
      const [, ...pattern] = parts;
      return `"RegExp(${pattern.join("/")}/${flags})"`;
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
