import { define } from "@/utils/fresh.ts";
import { keyCountToResponse, parseQuery, pathToKey } from "@/utils/kv.ts";
import { getToolbox } from "@/utils/kv_state.ts";
import { getLogger } from "@/utils/log.ts";

const logger = getLogger(["kview", "api", "store", "count"]);

export const handler = define.handlers({
  async GET(ctx) {
    const { id, path } = ctx.params;
    logger.debug("GET (count): {id}:{path}", { id, path });
    const prefix = pathToKey(path);
    const toolbox = await getToolbox(id, ctx);
    const query = ctx.url.searchParams.get("q");
    const data = await (query ? parseQuery(toolbox, prefix, query).counts() : toolbox.counts(prefix));
    return keyCountToResponse(data);
  },
});
