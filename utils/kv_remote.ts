import { encodeBase64Url } from "@std/encoding/base64url";

interface RemoteStoreInfo {
  url: string;
  name?: string;
  accessToken: string;
}

const KV_REMOTE_INDEX = "kv_remote_stores";
const KV_REMOTE_ITEM_PREFIX = "rkv_";

function getRemoteStores(): RemoteStoreInfo[] {
  const kvRemoteIndex: number[] = JSON.parse(localStorage.getItem(KV_REMOTE_INDEX) || "[]");
  const kvRemoteStores: RemoteStoreInfo[] = [];
  for (const id of kvRemoteIndex) {
    const item = localStorage.getItem(`${KV_REMOTE_ITEM_PREFIX}${id}`);
    if (item) {
      kvRemoteStores.push(JSON.parse(item));
    }
  }
  return kvRemoteStores;
}

export function findRemoteStoreById(id: string): RemoteStoreInfo | undefined {
  const stores = getRemoteStores();
  return stores.find(({ url }) => encodeBase64Url(url) === id);
}
