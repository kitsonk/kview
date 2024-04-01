import { type Handlers } from "$fresh/server.ts";
import { batchedAtomic } from "@kitsonk/kv-toolbox/batched_atomic";
import {
  type BlobJSON,
  getAsJSON,
  getMeta,
  remove,
  set,
  toValue as toBlob,
} from "@kitsonk/kv-toolbox/blob";
import { tree, uniqueCount } from "@kitsonk/kv-toolbox/keys";
import {
  entryToJSON,
  keyToJSON,
  type KvKeyJSON,
  type KvValueJSON,
  toKey,
  toValue,
} from "@kitsonk/kv-toolbox/json";
import { matches } from "@oak/commons/media_types";
import { assert } from "@std/assert/assert";
import {
  isBlobJSON,
  keyCountToResponse,
  pathToKey,
  treeToResponse,
} from "$utils/kv.ts";
import { getKv } from "$utils/kv_state.ts";

interface PutBody {
  value: KvValueJSON | BlobJSON;
  versionstamp?: string | null;
  expireIn?: number;
  overwrite?: boolean;
}

type DeleteBody = KvKeyJSON[] | { versionstamp: string };

function notFound() {
  return Response.json({ status: 404, statusText: "Not Found" }, {
    status: 404,
    statusText: "Not Found",
  });
}

export const handler: Handlers = {
  async GET(req, { params: { id, path } }) {
    const prefix = path === "" ? [] : pathToKey(path);
    const kv = await getKv(id);
    const url = new URL(req.url, import.meta.url);
    if (url.searchParams.has("entry")) {
      const maybeEntry = await kv.get(prefix);
      if (maybeEntry.versionstamp !== null) {
        return Response.json(entryToJSON(maybeEntry));
      } else {
        return notFound();
      }
    } else if (url.searchParams.has("blob")) {
      const maybeBlob = await getAsJSON(kv, prefix);
      if (maybeBlob) {
        return Response.json({
          value: maybeBlob,
          key: keyToJSON(prefix),
        });
      } else {
        return notFound();
      }
    } else if (url.searchParams.has("meta")) {
      const maybeMeta = await getMeta(kv, prefix);
      if (maybeMeta.value) {
        return Response.json({
          meta: maybeMeta.value,
          key: keyToJSON(prefix),
        });
      } else {
        return notFound();
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
      const kv = await getKv(id);
      const contentType = req.headers.get("content-type") ?? "";
      if (matches(contentType, ["application/json"])) {
        const { value, versionstamp = null, expireIn, overwrite }: PutBody =
          await req.json();
        if (isBlobJSON(value)) {
          await set(kv, key, toBlob(value), { expireIn });
          return Response.json({ ok: true });
        } else {
          assert(
            typeof value === "object" && "type" in value && "value" in value,
          );
          let op = kv.atomic();
          if (!overwrite) {
            op = op.check({ key, versionstamp });
          }
          op = op.set(key, toValue(value), { expireIn });
          const res = await op.commit();
          if (res.ok) {
            return Response.json(res);
          } else {
            return Response.json(res, { status: 409, statusText: "Conflict" });
          }
        }
      }
      if (matches(contentType, ["multipart/form-data"])) {
        const formData = await req.formData();
        const file = formData.get("file");
        if (file instanceof File) {
          await set(kv, key, file);
          return Response.json({ ok: true });
        } else {
          return Response.json({
            status: 400,
            statusText: "Bad Request",
            error: "Missing form field 'file'.",
          });
        }
      }
      if (contentType) {
        const blob = await req.blob();
        await set(kv, key, blob);
        return Response.json({ ok: true });
      }
      return Response.json({
        status: 400,
        statusText: "Bad Request",
        error: "No content type supplied.",
      });
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
        const url = new URL(req.url, import.meta.url);
        if (url.searchParams.has("blob")) {
          await remove(kv, key);
          return Response.json({ ok: true });
        } else {
          const { versionstamp } = body;
          const res = await kv
            .atomic().check({ key, versionstamp }).delete(key).commit();
          if (res.ok) {
            return Response.json(res);
          } else {
            return Response.json(res, { status: 409, statusText: "Conflict" });
          }
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
