import { define } from "@/utils/fresh.ts";
import { pathToKey } from "@/utils/kv.ts";
import { getToolbox } from "@/utils/kv_state.ts";
import { getLogger } from "@/utils/log.ts";

const logger = getLogger(["kview", "api", "store", "blob"]);

export const handler = define.handlers({
  async GET(ctx) {
    const { id, path } = ctx.params;
    const download = ctx.url.searchParams.has("download");
    logger.debug("GET (blob): {id}:{path} (download: {download})", { id, path, download });
    const key = pathToKey(path);
    const toolbox = await getToolbox(id, ctx);
    return toolbox.getAsBlob(key, { response: true, contentDisposition: download });
  },
});
