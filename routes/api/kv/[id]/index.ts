import { uniqueCount } from "kv_toolbox/keys.ts";
import { type RouteContext } from "$fresh/server.ts";

import { getKv, keyCountToResponse } from "$utils/kv.ts";

export default async function Kv(
  _req: Request,
  { params: { id } }: RouteContext,
) {
  const kv = await getKv(id);
  const data = await uniqueCount(kv);
  return keyCountToResponse(data);
}
