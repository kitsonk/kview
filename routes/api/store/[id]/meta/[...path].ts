import { HttpError } from "fresh";
import { keyToJSON } from "@deno/kv-utils/json";
import { define } from "@/utils/fresh.ts";
import { pathToKey } from "@/utils/kv.ts";
import { getToolbox } from "@/utils/kv_state.ts";
import { getLogger } from "@/utils/log.ts";

const logger = getLogger(["kview", "api", "store", "meta"]);

export const handler = define.handlers({
  async GET(ctx) {
    const { id, path } = ctx.params;
    logger.debug("GET: {id}:{path}", { id, path });
    const prefix = pathToKey(path);
    const toolbox = await getToolbox(id, ctx);
    const maybeMeta = await toolbox.getMeta(prefix);
    if (maybeMeta.value) {
      return Response.json({ meta: maybeMeta.value, versionStamp: maybeMeta.versionstamp, key: keyToJSON(prefix) });
    }
    throw new HttpError(404, "Blob meta not found");
  },
});
