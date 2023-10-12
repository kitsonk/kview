import { encodeBase64 } from "$std/encoding/base64.ts";

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

export type KvKeyPartJSON =
  | KvStringJSON
  | KvNumberJSON
  | KvBigIntJSON
  | KvBooleanJSON
  | KvUint8ArrayJSON;

export type KvKeyJSON = KvKeyPartJSON[];

export type KvValueJSON =
  | KvStringJSON
  | KvNumberJSON
  | KvBigIntJSON
  | KvNullJSON
  | KvBooleanJSON
  | KvUint8ArrayJSON
  | KvMapJSON
  | KvSetJSON
  | KvRegExpJSON
  | KvKvU64JSON
  | KvObjectJSON;

export interface KvEntryJSON {
  key: KvKeyJSON;
  value: KvValueJSON;
  versionstamp: string;
}

function toValueJSON(value: unknown): KvValueJSON {
  switch (typeof value) {
    case "bigint":
      return { type: "bigint", value: String(value) };
    case "boolean":
      return { type: "boolean", value };
    case "number":
      return { type: "number", value };
    case "object":
      if (value === null) {
        return { type: "null", value };
      }
      if (value instanceof Uint8Array) {
        return { type: "Uint8Array", value: encodeBase64(value) };
      }
      if (value instanceof Map) {
        return { type: "Map", value: [...value.entries()] };
      }
      if (value instanceof Set) {
        return { type: "Set", value: [...value] };
      }
      if (value instanceof RegExp) {
        return { type: "RegExp", value: String(value) };
      }
      if (value instanceof Deno.KvU64) {
        return { type: "KvU64", value: String(value) };
      }
      return { type: "object", value };
    case "string":
      return { type: "string", value };
    default:
      throw new TypeError("Unable to serialize value.");
  }
}

let currentId = "";
let p: Promise<Deno.Kv> | undefined;

export function getKv(id: string): Promise<Deno.Kv> {
  if (!p || currentId !== id) {
    currentId = id;
    p?.then((kv) => kv.close());
    p = Deno.openKv(`https://api.deno.com/databases/${id}/connect`);
  }
  return p;
}

export function pathToKey(path: string): Deno.KvKey {
  const key: Deno.KvKeyPart[] = [];
  for (const part of path.split("/")) {
    if (part === "true") {
      key.push(true);
    } else if (part === "false") {
      key.push(false);
    } else if (/[0-9]+n/.test(part)) {
      key.push(BigInt(part.slice(0, -1)));
    } else {
      const maybeNumber = parseInt(part, 10);
      if (maybeNumber.toString() === part) {
        key.push(maybeNumber);
      } else {
        key.push(part);
      }
    }
  }
  return key;
}

export function keyPartJsonToPath(key: KvKeyJSON): string {
  return key.map((keyPart) => {
    switch (keyPart.type) {
      case "Uint8Array":
        throw new TypeError("Uint8Array not currently supported.");
      case "bigint":
        return `${keyPart.value}n`;
      case "boolean":
        return String(keyPart.value);
      case "number":
        return String(keyPart.value);
      case "string":
        return keyPart.value;
    }
  }).join("/");
}

export function keyCountToResponse(
  data: { key: Deno.KvKey; count: number }[],
): Response {
  const body = JSON.stringify(
    data.map(({ key, count }) => ({ key: key.map(toValueJSON), count })),
  );
  return new Response(body, {
    headers: { "Content-Type": "application/json" },
    status: 200,
    statusText: "OK",
  });
}

export function entryToResponse(
  { key, value, versionstamp }: Deno.KvEntry<unknown>,
): Response {
  const body = JSON.stringify({
    key: key.map(toValueJSON),
    value: toValueJSON(value),
    versionstamp,
  });
  return new Response(body, {
    headers: { "Content-Type": "application/json" },
    status: 200,
    statusText: "OK",
  });
}
