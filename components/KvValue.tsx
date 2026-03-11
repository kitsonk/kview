import type { KvKeyJSON, KvValueJSON } from "@deno/kv-utils/json";
import type { BlobMeta } from "@kitsonk/kv-toolbox/blob";

import { ValueArray } from "./values/Array.tsx";
import { ValueBigInt } from "./values/BigInt.tsx";
import { ValueBinary } from "./values/Binary.tsx";
import { ValueRegExp } from "./values/RegExp.tsx";
import { ValueBoolean } from "./values/Boolean.tsx";
import { ValueError } from "./values/Error.tsx";
import { ValueField } from "./values/Field.tsx";
import { ValueMap } from "./values/Map.tsx";
import { ValueNull } from "./values/Null.tsx";
import { ValueObject } from "./values/Object.tsx";
import { ValueSet } from "./values/Set.tsx";
import { ValueUndefined } from "./values/Undefined.tsx";

type KvValueProps = {
  value: KvValueJSON;
  meta?: never;
  currentKey?: never;
  storeId?: never;
} | {
  value?: never;
  meta: BlobMeta;
  currentKey: KvKeyJSON;
  storeId: string;
};

export function KvValue({ value, meta, currentKey, storeId }: KvValueProps) {
  if (value) {
    switch (value.type) {
      case "Array":
        return <ValueArray value={value} />;
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
        return <ValueBinary value={value} />;
      case "bigint":
      case "KvU64":
        return <ValueBigInt value={value} />;
      case "boolean":
        return <ValueBoolean value={value} />;
      case "Date":
      case "number":
      case "string":
        return <ValueField value={value} />;
      case "Error":
      case "EvalError":
      case "RangeError":
      case "ReferenceError":
      case "SyntaxError":
      case "TypeError":
      case "URIError":
        return <ValueError value={value} />;
      case "Map":
        return <ValueMap value={value} />;
      case "RegExp":
        return <ValueRegExp value={value} />;
      case "null":
        return <ValueNull />;
      case "object":
        return <ValueObject value={value} />;
      case "Set":
        return <ValueSet value={value} />;
      case "undefined":
        return <ValueUndefined />;
      default:
        return (
          <div class="bg-base-100 border-base-300 divide-base-300 rounded-field divide-y border overflow-y-auto max-h-96 p-3">
            <pre>{JSON.stringify(value, null, 2)}</pre>
          </div>
        );
    }
  }
  if (meta && currentKey && storeId) {
    return <div class="input w-full">Blob: {meta.size} bytes</div>;
  }
}
