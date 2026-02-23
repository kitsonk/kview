import { HttpError } from "fresh";
import { entryToJSON } from "@deno/kv-utils/json";
import { define } from "@/utils/fresh.ts";
import { pathToKey } from "@/utils/kv.ts";
import { getToolbox } from "@/utils/kv_state.ts";
import { getLogger } from "@/utils/log.ts";

const logger = getLogger(["kview", "api", "store"]);

export const handler = define.handlers({
  async GET(ctx) {
    const { id, path } = ctx.params;
    logger.debug("GET: {id}:{path}", { id, path });
    const prefix = pathToKey(path);
    const toolbox = await getToolbox(id, ctx);
    const maybeEntry = await toolbox.get(prefix);
    if (maybeEntry.versionstamp !== null) {
      return Response.json(entryToJSON(maybeEntry));
    }
    throw new HttpError(404, "Entry not found");
  },
});
