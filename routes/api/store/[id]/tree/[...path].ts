import { define } from "@/utils/fresh.ts";
import { parseQuery, pathToKey, treeToResponse } from "@/utils/kv.ts";
import { getToolbox } from "@/utils/kv_state.ts";
import { getLogger } from "@/utils/log.ts";

const logger = getLogger(["kview", "api", "store", "tree"]);

export const handler = define.handlers({
  async GET(ctx) {
    const { id, path } = ctx.params;
    logger.debug("GET(tree): {id}:{path}", { id, path });
    const prefix = pathToKey(path);
    const toolbox = await getToolbox(id, ctx);
    const q = ctx.url.searchParams.get("q");
    const data = await (q ? parseQuery(toolbox, prefix, q).tree() : toolbox.tree(prefix));
    return treeToResponse(data);
  },
});
