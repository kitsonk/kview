import type { Context } from "fresh";
import { type KvToolbox, openKvToolbox } from "@kitsonk/kv-toolbox";
import { encodeBase64Url } from "@std/encoding/base64url";

import type { State } from "./fresh.ts";
import { findRemoteStoreById } from "./kv_remote.ts";
import { getLogger } from "./log.ts";
import { appState } from "./state.ts";

interface KvConnectionInfo {
  path: string;
  accessToken?: string;
}

const GUID_RE = /[a-f0-9]{8}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{12}/;
const DENO_KV_ACCESS_TOKEN = "DENO_KV_ACCESS_TOKEN";
let openPromise: Promise<KvToolbox> | undefined;
let currentKvStoreId: string | undefined;

const logger = getLogger(["kview", "utils", "kv_state"]);

function setAccessToken(token: string, ctx: Context<State>, setSession = false): void {
  Deno.env.set(DENO_KV_ACCESS_TOKEN, token);
  if (setSession) {
    ctx.state.sessionToken = token;
  }
}

export function getToolbox(id: string, ctx: Context<State>): Promise<KvToolbox> {
  if (openPromise && currentKvStoreId === id) {
    return openPromise;
  }
  logger.debug("Switching to ID: {id}", { id });
  const connectionInfo = getConnectionInfo(id, ctx);
  if (!connectionInfo) {
    logger.error("No connection info found for ID: {id}", { id });
    return Promise.reject(new Error(`No store found for ID: ${id}`));
  }
  currentKvStoreId = id;
  openPromise?.then((toolbox) => toolbox.close());
  const { path, accessToken } = connectionInfo;
  if (accessToken) {
    setAccessToken(accessToken, ctx);
  }
  logger.debug("Opening toolbox for path: {path}", { path });
  return openPromise = openKvToolbox({ path });
}

function getConnectionInfo(id: string, ctx: Context<State>): KvConnectionInfo | undefined {
  if (GUID_RE.test(id)) {
    return { path: `https://api.deno.com/databases/${id}/connect`, accessToken: ctx.state.sessionToken };
  }
  const maybeRemote = findRemoteStoreById(id);
  if (maybeRemote) {
    return { path: maybeRemote.url, accessToken: maybeRemote.accessToken };
  }
  const store = appState.localStores.value.find(({ id: storeId }) => storeId === id || id === encodeBase64Url(storeId));
  if (store) {
    return { path: store.path };
  }
  return undefined;
}
