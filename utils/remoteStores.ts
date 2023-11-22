import { decodeBase64Url, encodeBase64Url } from "$std/encoding/base64url.ts";

export interface RemoteStoreInfo {
  url: string;
  name?: string;
  accessToken: string;
}

const REMOTE_INDEX = "remote_index";
const ITEM_PREFIX = "rkv_";

const decoder = new TextDecoder();

export function findById(
  id: string,
  stores: RemoteStoreInfo[],
): RemoteStoreInfo | undefined {
  return stores.find(({ url }) => encodeBase64Url(url) === id);
}

export function decodeRemoteId(id: string): string {
  return decoder.decode(decodeBase64Url(id));
}

export function getRemoteStores(): RemoteStoreInfo[] {
  const ri = localStorage.getItem(REMOTE_INDEX);
  const index: number[] = JSON.parse(ri ?? "[]");
  const remoteStores: RemoteStoreInfo[] = [];
  for (const item of index) {
    const value = localStorage.getItem(`${ITEM_PREFIX}${item}`);
    if (value) {
      remoteStores.push(JSON.parse(value));
    }
  }
  return remoteStores;
}

export function setRemoteStores(remoteStores: RemoteStoreInfo[]) {
  const index: number[] = [];
  let counter = 0;
  for (const store of remoteStores) {
    counter++;
    localStorage.setItem(`${ITEM_PREFIX}${counter}`, JSON.stringify(store));
    index.push(counter);
  }
  localStorage.setItem(REMOTE_INDEX, JSON.stringify(index));
}

export function upsertRemoteStore(
  store: RemoteStoreInfo,
  stores: RemoteStoreInfo[],
): RemoteStoreInfo[] {
  const s: RemoteStoreInfo[] = [];
  let updated = false;
  for (const item of stores) {
    if (store.url === item.url) {
      updated = true;
      s.push(store);
    } else {
      s.push(item);
    }
  }
  if (!updated) {
    s.push(store);
  }
  return s;
}

export function replaceRemoteStore(
  url: string,
  store: RemoteStoreInfo,
  stores: RemoteStoreInfo[],
) {
  const s: RemoteStoreInfo[] = [];
  for (const item of stores) {
    if (item.url === url) {
      s.push(store);
    } else {
      s.push(item);
    }
  }
  return s;
}

export function deleteRemoteStore(
  store: RemoteStoreInfo,
  stores: RemoteStoreInfo[],
): RemoteStoreInfo[] {
  return stores.filter(({ url }) => url !== store.url);
}
