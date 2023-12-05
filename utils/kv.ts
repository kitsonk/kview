import { decodeBase64Url, encodeBase64Url } from "$std/encoding/base64url.ts";
import { join } from "$std/path/join.ts";

import { setAccessToken } from "./dash.ts";
import { findById } from "./remoteStores.ts";
import { state } from "./state.ts";

export interface KvLocalInfo {
  id: string;
  name?: string;
  path: string;
  size: number;
}

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

function toValueJSON(value: unknown): KvValueJSON {
  switch (typeof value) {
    case "bigint":
      return { type: "bigint", value: String(value) };
    case "boolean":
      return { type: "boolean", value };
    case "number":
      return { type: "number", value };
    case "undefined":
      return { type: "undefined", value };
    case "object":
      if (value === null) {
        return { type: "null", value };
      }
      if (value instanceof Uint8Array) {
        return { type: "Uint8Array", value: encodeBase64Url(value) };
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
      if (value instanceof Error) {
        const { name, message, stack } = value;
        return { type: "Error", value: { name, message, stack } };
      }
      if (value instanceof Date) {
        return { type: "Date", value: value.toJSON() };
      }
      return { type: "object", value };
    case "string":
      return { type: "string", value };
    default:
      throw new TypeError("Unable to serialize value.");
  }
}

export function isEditable(value: KvValueJSON | undefined): boolean {
  return !!(value && (!["Error", "Uint8Array"].includes(value.type)));
}

export function toValue(json: KvValueJSON): unknown {
  switch (json.type) {
    case "bigint":
      return BigInt(json.value);
    case "Uint8Array":
      return decodeBase64Url(json.value);
    case "Map":
      return new Map(json.value);
    case "Set":
      return new Set(json.value);
    case "RegExp": {
      const parts = json.value.split("/");
      const flags = parts.pop();
      const [, ...pattern] = parts;
      return new RegExp(pattern.join("/"), flags);
    }
    case "KvU64":
      return new Deno.KvU64(BigInt(json.value));
    case "Date":
      return new Date(json.value);
    case "boolean":
    case "number":
    case "null":
    case "object":
    case "string":
      return json.value;
    default:
      // deno-lint-ignore no-explicit-any
      throw new TypeError(`Unexpected value type: "${(json as any).type}"`);
  }
}

let currentId = "";
let p: Promise<Deno.Kv> | undefined;

const GUID_RE =
  /[a-f0-9]{8}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{12}/;

export function getKv(id: string): Promise<Deno.Kv> {
  if (p && currentId === id) {
    return p;
  }
  currentId = id;
  p?.then((kv) => kv.close());
  if (GUID_RE.test(id)) {
    return p = Deno.openKv(`https://api.deno.com/databases/${id}/connect`);
  } else {
    const maybeRemote = findById(id, state.remoteStores.value);
    if (maybeRemote) {
      setAccessToken(maybeRemote.accessToken);
      return p = Deno.openKv(maybeRemote.url);
    } else if (state.localStores.value) {
      const store = state.localStores.value.find(({ id: i }) => id === i);
      if (store) {
        return p = Deno.openKv(store.path);
      }
      throw new Error(`Store ID "${id}" not found.`);
    }
  }
  throw new Error("unreachable");
}

export function pathToKey(path: string): Deno.KvKey {
  const key: Deno.KvKeyPart[] = [];
  for (const part of path.split("/")) {
    if (part === "true") {
      key.push(true);
    } else if (part === "false") {
      key.push(false);
    } else if (part.startsWith("__u8__")) {
      key.push(decodeBase64Url(part.slice(6)));
    } else if (part.startsWith("__n__")) {
      key.push(parseInt(part.slice(5), 10));
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

export function keyJsonToPath(key: KvKeyJSON): string {
  return key.map((keyPart) => {
    switch (keyPart.type) {
      case "Uint8Array":
        return `__u8__${keyPart.value}`;
      case "bigint":
        return `${keyPart.value}n`;
      case "boolean":
        return String(keyPart.value);
      case "number":
        return `__n__${keyPart.value}`;
      case "string":
        return keyPart.value;
    }
  }).join("/");
}

export function keyToJson(key: Deno.KvKey): KvKeyJSON {
  return key.map(toValueJSON) as KvKeyJSON;
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

export async function localStores() {
  const stores: KvLocalInfo[] = [];
  const cache = cacheDir();
  if (cache) {
    const locationData = join(cache, "deno", "location_data");
    try {
      for await (
        const { name: id, isDirectory } of Deno.readDir(locationData)
      ) {
        if (isDirectory) {
          try {
            const path = join(locationData, id, "kv.sqlite3");
            const { isFile, size } = await Deno.stat(
              join(locationData, id, "kv.sqlite3"),
            );
            if (isFile) {
              stores.push({ id, path, size });
            }
          } catch {
            // just swallow here
          }
        }
      }
    } catch {
      // just swallow here
    }
  }
  return stores;
}

function cacheDir(): string | undefined {
  if (Deno.build.os === "darwin") {
    const home = homeDir();
    if (home) {
      return join(home, "Library/Caches");
    }
  } else if (Deno.build.os === "windows") {
    return Deno.env.get("LOCALAPPDATA");
  } else {
    const cacheHome = Deno.env.get("XDG_CACHE_HOME");
    if (cacheHome) {
      return cacheHome;
    } else {
      const home = homeDir();
      if (home) {
        return join(home, ".cache");
      }
    }
  }
}

function homeDir(): string | undefined {
  if (Deno.build.os === "windows") {
    Deno.permissions.request({ name: "env", variable: "USERPROFILE" });
    return Deno.env.get("USERPROFILE");
  } else {
    Deno.permissions.request({ name: "env", variable: "HOME" });
    return Deno.env.get("HOME");
  }
}
