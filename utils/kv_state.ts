import { encodeBase64Url } from "@std/encoding/base64url";

import { setAccessToken } from "./dash.ts";
import { findById } from "./remoteStores.ts";
import { state } from "./state.ts";

const GUID_RE =
  /[a-f0-9]{8}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{12}/;
let currentId = "";
let p: Promise<Deno.Kv> | undefined;

export function getKv(id: string): Promise<Deno.Kv> {
  if (p && currentId === id) {
    return p;
  }
  const info = getKvPath(id);
  if (!info) {
    throw new Error(`Store ID "${id}" not found.`);
  }

  currentId = id;
  p?.then((kv) => kv.close());
  const { path, accessToken } = info;
  if (accessToken) {
    setAccessToken(accessToken);
  }
  return p = Deno.openKv(path);
}

export function getKvPath(id: string): {
  path: string;
  accessToken?: string;
} | undefined {
  if (GUID_RE.test(id)) {
    return {
      path: `https://api.deno.com/databases/${id}/connect`,
      accessToken: state.sessionToken.peek(),
    };
  }
  const maybeRemote = findById(id, state.remoteStores.value);
  if (maybeRemote) {
    const { url, accessToken } = maybeRemote;
    return { path: url, accessToken };
  }
  if (state.localStores.value) {
    const store = state.localStores.value.find(({ id: i }) =>
      id === i || id === encodeBase64Url(i)
    );
    if (store) {
      const { path } = store;
      return { path };
    }
  }
}

export function getKvName(id: string): string | undefined {
  if (GUID_RE.test(id)) {
    return undefined;
  }
  const maybeRemote = findById(id, state.remoteStores.value);
  if (maybeRemote) {
    const { name, url } = maybeRemote;
    return name ?? url;
  }
  if (state.localStores.value) {
    const store = state.localStores.value.find(({ id: i }) =>
      id === i || id === encodeBase64Url(i)
    );
    if (store) {
      const { name } = store;
      return name;
    }
  }
}
