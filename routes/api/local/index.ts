import { type Handlers } from "$fresh/server.ts";
import { keys, mergeHeaders, SecureCookieMap, STORE_NAMES } from "$utils/cookies.ts";
import { LOCAL_STORES, localStores } from "$utils/kv.ts";
import { state } from "$utils/state.ts";
import { getLogger } from "$utils/logs.ts";

const logger = getLogger(["kview", "api", "local"]);

async function setName(
  value: string,
  id: string,
  req: Request,
): Promise<SecureCookieMap> {
  const cookies = new SecureCookieMap(req, { keys });
  const namesString = await cookies.get(STORE_NAMES);
  const names: [string, string][] = JSON.parse(namesString ?? "[]");
  const maybeName = names.find(([key]) => key === id);
  if (maybeName) {
    maybeName[1] = value;
  } else {
    names.push([id, value]);
  }
  await cookies.set(STORE_NAMES, JSON.stringify(names));
  return cookies;
}

export const handler: Handlers = {
  async POST(req) {
    const [id, value]: [string, string] = await req.json();
    logger.debug("POST: {id} = {value}", { id, value });
    const cookies = await setName(value, id, req);
    return new Response(null, {
      status: 204,
      statusText: "No Content",
      headers: mergeHeaders(cookies),
    });
  },
  async PUT(req) {
    try {
      const { id, path, name, previousPath }: {
        id?: string;
        path?: string;
        previousPath?: string;
        name?: string;
      } = await req.json();
      logger.debug("PUT: {id} = {name}, path: {path}, previousPath: {previousPath}", {
        id,
        name,
        path,
        previousPath,
      });
      if (path) {
        const { isFile } = await Deno.stat(path);
        if (isFile) {
          const localStoresString = localStorage.getItem(LOCAL_STORES) ?? "[]";
          let stores: string[] = JSON.parse(localStoresString);
          if (previousPath && previousPath !== path) {
            stores = stores.filter((p) => p !== previousPath);
          }
          if (!stores.some((p) => p === path)) {
            stores.push(path);
            localStorage.setItem(LOCAL_STORES, JSON.stringify(stores));
            state.localStores.value = await localStores();
          }
        }
      }
      if (name && id) {
        const cookies = await setName(name, id, req);
        return new Response(null, {
          status: 204,
          statusText: "No Content",
          headers: mergeHeaders(cookies),
        });
      } else {
        return new Response(null, { status: 204, statusText: "No Content" });
      }
    } catch (err) {
      return Response.json({
        status: 400,
        statusText: "Bad Request",
        error: JSON.stringify(err),
      }, { status: 400, statusText: "Bad Request" });
    }
  },
  async DELETE(req) {
    try {
      const { path }: { path: string } = await req.json();
      logger.debug("DELETE: {path}", { path });
      const localStoresString = localStorage.getItem(LOCAL_STORES);
      if (localStoresString) {
        const stores: string[] = JSON.parse(localStoresString);
        const updatedStores = stores.filter((p) => p !== path);
        localStorage.setItem(LOCAL_STORES, JSON.stringify(updatedStores));
        state.localStores.value = await localStores();
      }
      return new Response(null, { status: 204, statusText: "No Content" });
    } catch (err) {
      return Response.json({
        status: 400,
        statusText: "Bad Request",
        error: JSON.stringify(err),
      }, { status: 400, statusText: "Bad Request" });
    }
  },
};
