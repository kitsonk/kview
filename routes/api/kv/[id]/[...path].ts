import { type Handlers } from "$fresh/server.ts";
import { uniqueCount } from "kv_toolbox/keys.ts";
import { assert } from "$std/assert/assert.ts";
import {
  entryToResponse,
  getKv,
  keyCountToResponse,
  pathToKey,
  toValue,
} from "$utils/kv.ts";
import type { KvValueJSON } from "$utils/kv_json.ts";

interface PutBody {
  value: KvValueJSON;
  versionstamp?: string | null;
  expireIn?: number;
  overwrite?: boolean;
}

interface DeleteBody {
  versionstamp: string;
}

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
      const key = pathToKey(path);
      const { versionstamp }: DeleteBody = await req.json();
      const kv = await getKv(id);
      const res = await kv
        .atomic().check({ key, versionstamp }).delete(key).commit();
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
      }, { status: 400, statusText: "BadRequest" });
    }
  },
};
