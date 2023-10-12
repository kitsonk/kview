import { type MiddlewareHandler } from "$fresh/server.ts";
import {
  ACCESS_TOKEN,
  keys,
  mergeHeaders,
  SecureCookieMap,
} from "$utils/cookies.ts";
import { clearAccessToken, setAccessToken } from "$utils/dash.ts";

export const handler: MiddlewareHandler[] = [
  async function checkLoginState(req, { next }) {
    if (new URL(req.url).pathname === "/") {
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
  async function setAccessTokenFromCookie(req, { next }) {
    if (new URL(req.url).pathname !== "/login") {
      const cookies = new SecureCookieMap(req, { keys });
      const accessToken = await cookies.get(ACCESS_TOKEN);
      if (accessToken) {
        setAccessToken(accessToken);
      }
    }
    const r = await next();
    clearAccessToken();
    return r;
  },
];
