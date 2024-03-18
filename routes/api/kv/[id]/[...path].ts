import { type Handlers } from "$fresh/server.ts";
import { batchedAtomic } from "kv-toolbox/batched_atomic";
import { tree, uniqueCount } from "kv-toolbox/keys";
import { toKey, toValue } from "kv-toolbox/json";
import { assert } from "$std/assert/assert.ts";
import {
  entryToResponse,
  keyCountToResponse,
  pathToKey,
  treeToResponse,
} from "$utils/kv.ts";
import { getKv } from "$utils/kv_state.ts";
import type { KvKeyJSON, KvValueJSON } from "kv-toolbox/json";

interface PutBody {
  value: KvValueJSON;
  versionstamp?: string | null;
  expireIn?: number;
  overwrite?: boolean;
}

type DeleteBody = KvKeyJSON[] | { versionstamp: string };

export const handler: Handlers = {
  async GET(req, { params: { id, path } }) {
    const prefix = path === "" ? [] : pathToKey(path);
    const kv = await getKv(id);
    const url = new URL(req.url, import.meta.url);
    if (url.searchParams.has("entry")) {
      const maybeEntry = await kv.get(prefix);
      if (maybeEntry.versionstamp !== null) {
        return entryToResponse(maybeEntry);
      } else {
        return Response.json({ status: 404, statusText: "Not Found" }, {
          status: 404,
          statusText: "Not Found",
        });
      }
    } else if (url.searchParams.has("tree")) {
      const data = await tree(kv, prefix);
      return treeToResponse(data);
    } else {
      const data = await uniqueCount(kv, prefix);
      return keyCountToResponse(data);
    }
  },
  async PUT(req, { params: { id, path } }) {
    try {
      const key = pathToKey(path);
      const { value, versionstamp = null, expireIn, overwrite }: PutBody =
        await req.json();
      assert(typeof value === "object" && "type" in value && "value" in value);
      const kv = await getKv(id);
      let op = kv.atomic();
      if (!overwrite) {
        op = op.check({ key, versionstamp });
      }
      op = op.set(key, toValue(value), { expireIn });
      const res = await op.commit();
      if (res.ok) {
        return Response.json(res, { status: 200, statusText: "OK" });
      } else {
        return Response.json(res, { status: 409, statusText: "Conflict" });
      }
    } catch (err) {
      return Response.json({
        status: 400,
        statusText: "Bad Request",
        error: JSON.stringify(err),
      }, { status: 400, statusText: "Bad Request" });
    }
  },
  async DELETE(req, { params: { id, path } }) {
    try {
      const kv = await getKv(id);
      const key = pathToKey(path);
      const body: DeleteBody = await req.json();
      if (Array.isArray(body)) {
        const op = batchedAtomic(kv);
        for (const item of body) {
          op.delete([...key, ...toKey(item)]);
        }
        const results = await op.commit();
        for (const res of results) {
          if (!res.ok) {
            return Response.json(res, {
              status: 422,
              statusText: "Unprocessable Content",
            });
          }
        }
        return Response.json(results, { status: 200, statusText: "OK" });
      } else {
        const { versionstamp } = body;
        const res = await kv
          .atomic().check({ key, versionstamp }).delete(key).commit();
        if (res.ok) {
          return Response.json(res, { status: 200, statusText: "OK" });
        } else {
          return Response.json(res, { status: 409, statusText: "Conflict" });
        }
      }
    } catch (err) {
      return Response.json({
        status: 400,
        statusText: "Bad Request",
        error: JSON.stringify(err),
      }, { status: 400, statusText: "BadRequest" });
    }
  },
};
