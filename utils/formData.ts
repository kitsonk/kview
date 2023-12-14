import type { KvKeyPartJSON, KvValueJSON } from "./kv_json.ts";

export function formDataToKvKeyPartJSON(
  type: string,
  value: string,
): KvKeyPartJSON {
  switch (type) {
    case "string":
    case "bigint":
    case "Uint8Array":
      return { type, value };
    case "number":
      return { type, value: parseInt(value, 10) };
    case "boolean":
      return { type, value: value === "true" ? true : false };
    default:
      throw new TypeError(`Unexpected type: "${type}"`);
  }
}

export function formDataToKvValueJSON(
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
    case "Map":
    case "Set":
    case "object":
      return { type, value: JSON.parse(value) };
    case "RegExp":
    case "Date":
    case "KvU64":
      return { type, value };
    default:
      throw new TypeError(`Unexpected type: "${type}"`);
  }
}
