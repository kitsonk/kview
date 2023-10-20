import { type Handlers } from "$fresh/server.ts";
import {
  keys,
  mergeHeaders,
  SecureCookieMap,
  STORE_NAMES,
} from "$utils/cookies.ts";

export const handler: Handlers = {
  async POST(req) {
    const cookies = new SecureCookieMap(req, { keys });
    const namesValue = await cookies.get(STORE_NAMES);
    const names: [string, string][] = namesValue ? JSON.parse(namesValue) : [];
    const [id, value]: [string, string] = await req.json();
    const maybeName = names.find(([key]) => key === id);
    if (maybeName) {
      maybeName[1] = value;
    } else {
      names.push([id, value]);
    }
    await cookies.set(STORE_NAMES, JSON.stringify(names));
    return new Response(null, {
      status: 204,
      statusText: "No Content",
      headers: mergeHeaders(cookies),
    });
  },
};
