import { type Handlers } from "$fresh/server.ts";
import { pathToKey } from "$utils/kv.ts";
import { getKv } from "$utils/kv_state.ts";
import { getAsStream, getMeta } from "jsr:@kitsonk/kv-toolbox@0.15/blob";

export const handler: Handlers = {
  async GET(_req, { params: { id, path } }) {
    const key = path === "" ? [] : pathToKey(path);
    const kv = await getKv(id);
    const meta = await getMeta(kv, key);
    if (!meta) {
      return Response.json({ status: 404, statusText: "Not Found" }, {
        status: 404,
        statusText: "Not Found",
      });
    }
    const body = getAsStream(kv, key);
    const contentType = meta.kind === "file" || meta.kind === "blob"
      ? meta.type
      : "application/octet-stream";
    return new Response(body, { headers: { "content-type": contentType } });
  },
};
