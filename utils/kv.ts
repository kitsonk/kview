import { type KeyTree } from "kv-toolbox/keys";
import { decodeBase64Url } from "$std/encoding/base64url.ts";
import { join } from "$std/path/join.ts";

import {
  entryToJSON,
  keyPartToJSON,
  type KvKeyJSON,
  type KvKeyPartJSON,
  type KvValueJSON,
  valueToJSON,
} from "kv-toolbox/json";

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

export function isEditable(value: KvValueJSON | undefined): boolean {
  return !!(value && (!["Error", "Uint8Array"].includes(value.type)));
}

export function pathToKey(path: string): Deno.KvKey {
  const key: Deno.KvKeyPart[] = [];
  if (path === "") {
    return key;
  }
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

export function keyCountToResponse(
  data: { key: Deno.KvKey; count: number }[],
): Response {
  const body = data.map(({ key, count }) => ({
    key: key.map(valueToJSON),
    count,
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

export function entryToResponse(entry: Deno.KvEntry<unknown>): Response {
  const body = JSON.stringify(entryToJSON(entry));
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
