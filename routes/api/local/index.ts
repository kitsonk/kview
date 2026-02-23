import { define } from "@/utils/fresh.ts";
import { addLocalStore, getLocalStores, setLocalStoreName } from "@/utils/kv.ts";
import { getLogger } from "@/utils/log.ts";
import { appState } from "@/utils/state.ts";

const logger = getLogger(["kview", "api", "local"]);

export const handler = define.handlers({
  GET(_ctx) {
    return Response.json(appState.localStores.value);
  },
  async POST(ctx) {
    const [id, value]: [string, string] = await ctx.req.json();
    logger.debug("POST: {id} = {value}", { id, value });
    setLocalStoreName(id, value);
    appState.localStores.value = await getLocalStores();
    return new Response(null, {
      status: 204,
      statusText: "No Content",
    });
  },
  async PUT(ctx) {
    try {
      const { id, path, name, previousPath }: {
        id?: string;
        path?: string;
        previousPath?: string;
        name?: string;
      } = await ctx.req.json();
      logger.debug("PUT: {id} = {name}, path: {path}, previousPath: {previousPath}", {
        id,
        name,
        path,
        previousPath,
      });
      let dirty = false;
      if (path) {
        const { isFile } = await Deno.stat(path);
        if (isFile) {
          addLocalStore(path, previousPath);
          dirty = true;
        }
      }
      if (name && id) {
        setLocalStoreName(id, name);
        dirty = true;
      }
      if (dirty) {
        appState.localStores.value = await getLocalStores();
      }
      return new Response(null, { status: 204, statusText: "No Content" });
    } catch (err) {
      return Response.json({
        status: 400,
        statusText: "Bad Request",
        error: JSON.stringify(err),
      }, { status: 400, statusText: "Bad Request" });
    }
  },
});
