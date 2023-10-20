import { type MiddlewareHandler } from "$fresh/server.ts";
import {
  ACCESS_TOKEN,
  keys,
  mergeHeaders,
  SecureCookieMap,
  STORE_NAMES,
} from "$utils/cookies.ts";
import { clearAccessToken, setAccessToken } from "$utils/dash.ts";
import { localStores } from "$utils/kv.ts";
import { state } from "$utils/state.ts";

export const handler: MiddlewareHandler[] = [
  async function checkLoginState(req, { next }) {
    const pattern = new URLPattern("/:path(user|orgs)", req.url);
    if (pattern.test(req.url)) {
      const cookies = new SecureCookieMap(req, { keys });
      if (!(await cookies.has(ACCESS_TOKEN))) {
        return new Response("", {
          status: 307,
          statusText: "Temporary Redirect",
          headers: mergeHeaders({ "Location": "/login" }, cookies),
        });
      }
    }
    return next();
  },
  async function setStateFromCookies(req, { next }) {
    if (!state.localStores.value) {
      state.localStores.value = await localStores();
    }
    if (new URL(req.url).pathname !== "/login") {
      const cookies = new SecureCookieMap(req, { keys });
      const accessToken = await cookies.get(ACCESS_TOKEN);
      if (accessToken) {
        setAccessToken(accessToken);
      }
      const storeNamesValue = await cookies.get(STORE_NAMES);
      if (storeNamesValue) {
        const storeNames: [string, string][] = JSON.parse(storeNamesValue);
        for (const [key, name] of storeNames) {
          const store = state.localStores.value.find(({ id }) => id === key);
          if (store) {
            store.name = name;
          }
        }
      }
    }
    const r = await next();
    clearAccessToken();
    return r;
  },
];
