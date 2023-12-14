interface KvStringJSON {
  type: "string";
  value: string;
}

interface KvNumberJSON {
  type: "number";
  value: number;
}

interface KvBigIntJSON {
  type: "bigint";
  value: string;
}

interface KvNullJSON {
  type: "null";
  value: null;
}

interface KvUndefinedJSON {
  type: "undefined";
  value: undefined;
}

interface KvBooleanJSON {
  type: "boolean";
  value: boolean;
}

interface KvUint8ArrayJSON {
  type: "Uint8Array";
  value: string;
}

interface KvMapJSON {
  type: "Map";
  value: [unknown, unknown][];
}

interface KvSetJSON {
  type: "Set";
  value: unknown[];
}

interface KvRegExpJSON {
  type: "RegExp";
  value: string;
}

interface KvKvU64JSON {
  type: "KvU64";
  value: string;
}

interface KvObjectJSON {
  type: "object";
  value: unknown;
}

interface KvErrorJSON {
  type: "Error";
  value: {
    name: string;
    message: string;
    stack?: string;
  };
}

interface KvDateJSON {
  type: "Date";
  value: string;
}

/** JSON representations of Deno KV key parts. This represents each key part
 * type the is supported by Deno KV. */
export type KvKeyPartJSON =
  | KvStringJSON
  | KvNumberJSON
  | KvBigIntJSON
  | KvBooleanJSON
  | KvUint8ArrayJSON;

/** A JSON representation of a Deno KV key, which is an array of
 * {@linkcode KvKeyPartJSON} items. */
export type KvKeyJSON = KvKeyPartJSON[];

/** JSON representations of Deno KV values, where the value types are exhaustive
 * of what Deno KV supports and are allowed via structure cloning
 * (transferrable). */
export type KvValueJSON =
  | KvStringJSON
  | KvNumberJSON
  | KvBigIntJSON
  | KvNullJSON
  | KvUndefinedJSON
  | KvBooleanJSON
  | KvUint8ArrayJSON
  | KvMapJSON
  | KvSetJSON
  | KvRegExpJSON
  | KvKvU64JSON
  | KvObjectJSON
  | KvErrorJSON
  | KvDateJSON;

export interface KvEntryJSON {
  key: KvKeyJSON;
  value: KvValueJSON;
  versionstamp: string;
}
