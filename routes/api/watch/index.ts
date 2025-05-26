import { Handlers } from "$fresh/server.ts";
import { type KvKeyJSON } from "@deno/kv-utils/json";
import { getLogger } from "$utils/logs.ts";
import { state } from "$utils/state.ts";
import { addWatch, deleteWatch, serialize } from "$utils/watches.ts";

interface WatchBody {
  databaseId: string;
  key: KvKeyJSON;
  name?: string;
  href?: string;
}

const logger = getLogger(["kview", "api", "watch"]);

function assertBody(value: unknown): asserts value is WatchBody {
  if (
    !(typeof value === "object" && value && "databaseId" in value &&
      "key" in value)
  ) {
    throw new Error("Badly formatted body.");
  }
}

export const handler: Handlers = {
  GET(_req, _ctx) {
    logger.debug("GET");
    return Response.json(serialize(state.watches.value));
  },
  async PUT(req, _ctx) {
    try {
      const body = await req.json();
      assertBody(body);
      const { databaseId, key, name, href } = body;
      logger.debug("PUT: {databaseId}:{key}", {
        databaseId,
        key: JSON.stringify(key),
      });
      state.watches.value = addWatch(
        databaseId,
        { key, name, href },
        state.watches.value,
      );
      return Response.json({ status: 200, statusText: "OK" });
    } catch (err) {
      return Response.json({
        status: 400,
        statusText: "Bad Request",
        error: JSON.stringify(err),
      }, { status: 400, statusText: "Bad Request" });
    }
  },
  async DELETE(req, _ctx) {
    try {
      const body = await req.json();
      assertBody(body);
      const { databaseId, key } = body;
      logger.debug("DELETE: {databaseId}:{key}", {
        databaseId,
        key: JSON.stringify(key),
      });
      state.watches.value = deleteWatch(databaseId, key, state.watches.value);
      return Response.json({ status: 200, statusText: "OK" });
    } catch (err) {
      return Response.json({
        status: 400,
        statusText: "Bad Request",
        error: JSON.stringify(err),
      }, { status: 400, statusText: "Bad Request" });
    }
  },
};
