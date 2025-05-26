import { type Handlers } from "$fresh/server.ts";
import { openKvToolbox } from "@kitsonk/kv-toolbox";
import { pathToKey } from "$utils/kv.ts";
import { importNdJson } from "$utils/kv_bulk.ts";
import { getKvPath } from "$utils/kv_state.ts";
import { setAccessToken } from "$utils/dash.ts";
import { getLogger } from "$utils/logs.ts";

const logger = getLogger(["kview", "api", "kv", "_bulk"]);

export const handler: Handlers = {
  async GET(_req, { params: { id, path = "" } }) {
    logger.debug("GET: {id}:{path}", { id, path });
    const prefix = path === "" ? [] : pathToKey(path);
    const info = getKvPath(id);
    if (!info) {
      logger.info("Not Found: {id}:{path}", { id, path });
      return Response.json({ status: 404, statusText: "Not Found" }, {
        status: 404,
        statusText: "Not Found",
      });
    }
    const { path: kvPath, accessToken } = info;
    if (accessToken) {
      setAccessToken(accessToken);
    }
    const kv = await openKvToolbox({ path: kvPath });
    return kv.export({ prefix }, {
      type: "response",
      filename: id,
      close: true,
    });
  },
  async POST(req, { params: { id, path = "" } }) {
    logger.debug("POST: {id}:{path}", { id, path });
    const prefix = path === "" ? [] : pathToKey(path);
    if (!req.body) {
      logger.info("Bad Request: {id}:{path}", { id, path });
      return Response.json({ status: 400, statusText: "Bad Request" }, {
        status: 400,
        statusText: "Bad Request",
      });
    }
    const overwrite = req.headers.has("kview-overwrite");
    const name = req.headers.get("kview-name");
    const href = req.headers.get("kview-href");
    const data = await req.bytes();
    logger.debug("start: {id}:{path} overwrite: {overwrite}, name: {name}, href: {href}", {
      id,
      path,
      overwrite,
      name,
      href,
    });
    const job = await importNdJson(id, prefix, data, { overwrite, name, href });
    if (!job) {
      logger.info("Not Found: {id}:{path}, name: {name}, href: {href}", { id, path, name, href });
      return Response.json({ status: 404, statusText: "Not Found" }, {
        status: 404,
        statusText: "Not Found",
      });
    }
    return Response.json({ status: 201, statusText: "Created", id: job.id }, {
      status: 201,
      statusText: "Created",
      headers: {
        "location": `/api/jobs/${id}`,
      },
    });
  },
};
