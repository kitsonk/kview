import { type Handlers } from "$fresh/server.ts";
import { getAsStream, getMeta } from "@kitsonk/kv-toolbox/blob";
import { extension } from "@std/media-types/extension";
import { pathToKey } from "$utils/kv.ts";
import { getKv } from "$utils/kv_state.ts";

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
    let filename;
    if (meta.kind === "file" && meta.name) {
      filename = meta.name;
    } else {
      const base = path.split("/").pop() || "download";
      filename = `${base}.${extension(contentType) ?? "bin"}`;
    }
    return new Response(body, {
      headers: {
        "content-type": contentType,
        "content-disposition": `attachment; filename="${filename}"`,
      },
    });
  },
};
