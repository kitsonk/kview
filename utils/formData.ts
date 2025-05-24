import { type BlobJSON, toJSON } from "@kitsonk/kv-toolbox/blob";
import { type KvKeyPartJSON, type KvValueJSON, valueToJSON } from "@deno/kv-utils/json";
import { assert } from "@std/assert/assert";
import { decodeBase64Url } from "@std/encoding/base64url";

export function getByteLength(value: string): number {
  try {
    return decodeBase64Url(value).byteLength;
  } catch {
    return 0;
  }
}

export function formDataToKvKeyPartJSON(
  type: string,
  value: string,
): KvKeyPartJSON {
  switch (type) {
    case "string":
    case "bigint":
      return { type, value };
    case "Uint8Array":
      return { type, value, byteLength: getByteLength(value) };
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
      case "Map": {
        const parsedValue = JSON.parse(value);
        assert(Array.isArray(parsedValue), "Expected an array.");
        return valueToJSON(new Map(parsedValue));
      }
      case "Set": {
        const parsedValue = JSON.parse(value);
        assert(Array.isArray(parsedValue), "Expected an array.");
        return valueToJSON(new Set(parsedValue));
      }
      case "Array": {
        const parsedValue = JSON.parse(value);
        assert(Array.isArray(parsedValue), "Expected an array.");
        return { type, value: parsedValue.map(valueToJSON) };
      }
      case "object": {
        const parsedValue = JSON.parse(value);
        assert(
          typeof parsedValue === "object" && parsedValue !== null,
          "Expected an object.",
        );
        return {
          type,
          value: Object.fromEntries(
            Object.entries(parsedValue)
              .map(([key, value]) => [key, valueToJSON(value)]),
          ),
        };
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
  throw new TypeError(`Unexpected form data.`);
}
