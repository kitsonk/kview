import { type BlobJSON, toJSON } from "@kitsonk/kv-toolbox/blob";
import { type KvKeyPartJSON, type KvValueJSON } from "@kitsonk/kv-toolbox/json";

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

export async function formDataToKvValueJSON(
  type: string,
  value: string | null,
  file: File | null,
): Promise<KvValueJSON | BlobJSON> {
  if (file) {
    switch (type) {
      case "buffer":
        return toJSON(await file.arrayBuffer());
      case "Blob":
        return toJSON(new Blob([file], { type: file.type }));
      case "File":
        return toJSON(file);
    }
  }
  if (value) {
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
  throw new TypeError(`Unexpected form data.`);
}
