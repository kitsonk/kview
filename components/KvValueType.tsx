import type { KvValueJSON } from "@deno/kv-utils/json";
import type { BlobMeta } from "@kitsonk/kv-toolbox/blob";

export function KvValueType({ type, meta }: { type: KvValueJSON["type"]; meta?: BlobMeta }) {
  if (meta) {
    switch (meta.kind) {
      case "blob":
        return <span class="badge badge-neutral">Blob</span>;
      case "file":
        return <span class="badge badge-neutral">File</span>;
      default:
        return <span class="badge badge-neutral">Binary Data</span>;
    }
  }
  switch (type) {
    case "KvU64":
      return <span class="badge badge-info">Deno.KvU64</span>;
    case "Map":
      return <span class="badge badge-warning">Map</span>;
    case "RegExp":
      return <span class="badge badge-warning">RegExp</span>;
    case "Set":
      return <span class="badge badge-warning">Set</span>;
    case "Date":
      return <span class="badge badge-warning">Date</span>;
    case "ArrayBuffer":
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
    case "DataView":
      return <span class="badge badge-accent">{type}</span>;
    case "Error":
    case "EvalError":
    case "RangeError":
    case "ReferenceError":
    case "SyntaxError":
    case "TypeError":
    case "URIError":
      return <span class="badge badge-error">{type}</span>;
    case "Array":
      return <span class="badge badge-secondary">Array</span>;
    case "object":
      return <span class="badge badge-secondary">Object</span>;
    case "string":
      return <span class="badge badge-primary">String</span>;
    case "number":
      return <span class="badge badge-secondary">Number</span>;
    case "bigint":
      return <span class="badge badge-info">BigInt</span>;
    case "boolean":
      return <span class="badge badge-warning">Boolean</span>;
    case "null":
      return <span class="badge badge-neutral">Null</span>;
    case "undefined":
      return <span class="badge badge-neutral">Undefined</span>;
    default:
      return <span class="badge badge-neutral italic">{type}</span>;
  }
}
