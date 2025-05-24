import { KvToolbox } from "@kitsonk/kv-toolbox";
import type { BlobJSON, BlobMeta } from "@kitsonk/kv-toolbox/blob";
import type { KeyTree } from "@kitsonk/kv-toolbox/keys";
import { Query } from "@kitsonk/kv-toolbox/query";
import {
  keyPartToJSON,
  keyToJSON,
  type KvKeyJSON,
  type KvKeyPartJSON,
  type KvValueJSON,
  valueToJSON,
} from "@deno/kv-utils/json";
import { decodeBase64Url } from "@std/encoding/base64url";
import { join } from "@std/path/join";
import inspect from "object-inspect";

export interface KvKeyTreeNodeJSON {
  part: KvKeyPartJSON;
  hasValue?: true;
  children?: KvKeyTreeNodeJSON[];
}

export interface KvKeyTreeJSON {
  prefix?: KvKeyJSON;
  children?: KvKeyTreeNodeJSON[];
}

export interface KvLocalInfo {
  id: string;
  name?: string;
  path: string;
  size: number;
}

export const LOCAL_STORES = "local_stores";

export function isBlobMeta(value: unknown): value is BlobMeta {
  return !!(typeof value === "object" && value && "kind" in value &&
    typeof value.kind === "string");
}

export function isBlobJSON(value: unknown): value is BlobJSON {
  return !!(typeof value === "object" && value && "meta" in value &&
    "parts" in value);
}

function containsComplex(value: KvValueJSON): boolean {
  switch (value.type) {
    case "Array":
    case "Set":
      return value.value.some(containsComplex);
    case "Map":
      return value.value.some(([key, value]) => containsComplex(key) || containsComplex(value));
    case "object":
      return Object.entries(value.value).some(([_, value]) => containsComplex(value));
    case "string":
    case "number":
    case "boolean":
    case "undefined":
    case "null":
      return false;
    default:
      return true;
  }
}

export function isEditable(value: KvValueJSON | BlobMeta | undefined): boolean {
  if (!value) {
    return false;
  }
  if (isBlobMeta(value)) {
    return true;
  }
  switch (value.type) {
    case "Array":
    case "Map":
    case "object":
    case "Set":
      return !containsComplex(value);
  }
  return ![
    "Error",
    "EvalError",
    "RangeError",
    "ReferenceError",
    "SyntaxError",
    "TypeError",
    "URIError",
    "ArrayBuffer",
    "Int8Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "Int16Array",
    "Uint16Array",
    "Int32Array",
    "Uint32Array",
    "Float32Array",
    "Float64Array",
    "BigInt64Array",
    "BigUint64Array",
    "DataView",
  ].includes(value.type);
}

export function replacer(_key: string, value: unknown) {
  if (typeof value === "bigint") {
    return `BigInt {${inspect(value)}}`;
  }
  if ("Deno" in globalThis && value instanceof Deno.KvU64) {
    return `Deno.KvU64 {${value.value}nkv}`;
  }
  if (value instanceof RegExp) {
    return `RegExp {${value.toString()}}`;
  }
  if (value instanceof Error) {
    return value.stack;
  }
  if (value instanceof Date) {
    return `Date {${value.toISOString()}}`;
  }
  if (
    value instanceof Set || value instanceof Map || ArrayBuffer.isView(value) ||
    value instanceof ArrayBuffer
  ) {
    return inspect(value);
  }
  return value;
}

export function pathToKey(path: string): Deno.KvKey {
  const key: Deno.KvKeyPart[] = [];
  if (path === "") {
    return key;
  }
  for (const part of path.split("/")) {
    if (part === "__empty_string__") {
      key.push("");
    } else if (part === "__true__") {
      key.push(true);
    } else if (part === "__false__") {
      key.push(false);
    } else if (part.startsWith("__u8__")) {
      key.push(decodeBase64Url(part.slice(6)));
    } else if (/^__n__[0-9]+$/.test(part)) {
      key.push(parseInt(part.slice(5), 10));
    } else if (part === "__n__Infinity") {
      key.push(Infinity);
    } else if (part === "__n__-Infinity") {
      key.push(-Infinity);
    } else if (part === "__n__NaN") {
      key.push(NaN);
    } else if (/^__b__[0-9]+$/.test(part)) {
      key.push(BigInt(part.slice(5)));
    } else {
      key.push(decodeURIComponent(part));
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
        return `__b__${keyPart.value}`;
      case "boolean":
        return keyPart.value ? "__true__" : "__false__";
      case "number":
        return `__n__${keyPart.value}`;
      case "string":
        if (keyPart.value === "") {
          return "__empty_string__";
        }
        return encodeURIComponent(keyPart.value);
    }
  }).join("/");
}

export function keyCountToResponse(
  data: { key: Deno.KvKey; count: number; isBlob?: boolean }[],
): Response {
  const body = data.map(({ key, ...rest }) => ({
    key: key.map(valueToJSON),
    ...rest,
  }));
  return Response.json(body);
}

interface KeyTreeNode {
  part: Deno.KvKeyPart;
  hasValue?: true;
  children?: KeyTreeNode[];
}

function nodeToJSON(
  { part, hasValue, children }: KeyTreeNode,
): KvKeyTreeNodeJSON {
  const result: KvKeyTreeNodeJSON = { part: keyPartToJSON(part) };
  if (hasValue) {
    result.hasValue = hasValue;
  }
  if (children) {
    result.children = children.map(nodeToJSON);
  }
  return result;
}

export function treeToResponse({ prefix, children }: KeyTree): Response {
  const body: KvKeyTreeJSON = {};
  if (prefix) {
    body.prefix = prefix.map(keyPartToJSON);
  }
  if (children) {
    body.children = children.map(nodeToJSON);
  }
  return Response.json(body);
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
  const localStoresString = localStorage.getItem(LOCAL_STORES);
  if (localStoresString) {
    const localStores: string[] = JSON.parse(localStoresString);
    const validStores: string[] = [];
    for (const path of localStores) {
      const { isFile, size } = await Deno.stat(path);
      if (isFile) {
        stores.push({ id: path, path, size });
        validStores.push(path);
      }
    }
    localStorage.setItem(LOCAL_STORES, JSON.stringify(validStores));
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

const decoder = new TextDecoder();

export function parseQuery(
  kv: KvToolbox,
  prefix: Deno.KvKey,
  filtersString: string,
): Query {
  return Query.parse(kv.db, {
    selector: { prefix: keyToJSON(prefix) },
    filters: JSON.parse(decoder.decode(decodeBase64Url(filtersString))),
  });
}
