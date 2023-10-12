import { uniqueCount } from "kv_toolbox/keys.ts";
import { type RouteContext } from "$fresh/server.ts";

import {
  entryToResponse,
  getKv,
  keyCountToResponse,
  pathToKey,
} from "$utils/kv.ts";

export default async function KvPath(
  _req: Request,
  { params: { id, path }, url }: RouteContext,
) {
  const prefix = pathToKey(path);
  const kv = await getKv(id);
  if (url.searchParams.has("entry")) {
    const maybeEntry = await kv.get(prefix);
    if (maybeEntry.versionstamp !== null) {
      return entryToResponse(maybeEntry);
    } else {
      return Response.json({ status: 404, statusText: "Not Found" }, {
        status: 404,
        statusText: "Not Found",
      });
    }
  } else {
    const data = await uniqueCount(kv, prefix);
    return keyCountToResponse(data);
  }
}
