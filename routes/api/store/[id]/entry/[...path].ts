import { HttpError } from "fresh";
import { entryToJSON, type KvValueJSON, toValue } from "@deno/kv-utils/json";
import { define } from "@/utils/fresh.ts";
import { pathToKey } from "@/utils/kv.ts";
import { getToolbox } from "@/utils/kv_state.ts";
import { getLogger } from "@/utils/log.ts";

const logger = getLogger(["kview", "api", "store"]);

const UNSUPPORTED_TYPES = new Set<string>([
  "ArrayBuffer",
  "DataView",
  "Int8Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Int16Array",
  "Uint16Array",
  "Int32Array",
  "Uint32Array",
  "Float32Array",
  "Float64Array",
  "BigInt64Array",
  "BigUint64Array",
]);

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
  async PUT(ctx) {
    const { id, path } = ctx.params;
    logger.debug("PUT: {id}:{path}", { id, path });
    const key = pathToKey(path);
    let body: unknown;
    try {
      body = await ctx.req.json();
    } catch (err) {
      throw new HttpError(400, `Invalid JSON body: ${(err as Error).message}`);
    }
    if (
      !body || typeof body !== "object" || !("type" in body) || typeof (body as { type: unknown }).type !== "string"
    ) {
      throw new HttpError(400, "Body must be a KvValueJSON with a string `type` field");
    }
    const json = body as KvValueJSON;
    if (UNSUPPORTED_TYPES.has(json.type)) {
      throw new HttpError(501, `Blob/buffer values (${json.type}) are not yet supported`);
    }
    let value: unknown;
    try {
      value = toValue(json);
    } catch (err) {
      throw new HttpError(400, `Failed to deserialize value: ${(err as Error).message}`);
    }
    const toolbox = await getToolbox(id, ctx);
    await toolbox.set(key, value);
    const entry = await toolbox.get(key);
    if (entry.versionstamp === null) {
      throw new HttpError(500, "Entry was not persisted");
    }
    return Response.json(entryToJSON(entry));
  },
});
