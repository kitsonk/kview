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
    case "number": {
      const parsed = parseFloat(value);
      return {
        type,
        value: Number.isNaN(parsed)
          ? "NaN"
          : parsed === Infinity
          ? "Infinity"
          : parsed === -Infinity
          ? "-Infinity"
          : parsed,
      };
    }
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
      case "Array":
      case "Map":
      case "Set":
      case "object":
        return { type, value: JSON.parse(value) };
      case "RegExp":
      case "Date":
      case "KvU64":
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
        return { type, value };
      default:
        throw new TypeError(`Unexpected type: "${type}"`);
    }
  }
  throw new TypeError(`Unexpected form data.`);
}
