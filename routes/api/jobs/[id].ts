import { type Handlers } from "$fresh/server.ts";
import { abort, getJob } from "$utils/kv_bulk.ts";
import { getLogger } from "@logtape/logtape";

const logger = getLogger(["kview", "api", "jobs", "id"]);

export const handler: Handlers = {
  GET(_req, { params: { id } }) {
    logger.debug("GET: {id}", { id });
    const job = getJob(parseInt(id, 10));
    if (job) {
      return Response.json({ status: 200, statusText: "OK", job });
    }
    logger.info("Not Found: {id}", { id });
    return Response.json({ status: 404, statusText: "Not Found", id }, {
      status: 404,
      statusText: "Not Found",
    });
  },
  DELETE(_req, { params: { id } }) {
    logger.debug("DELETE: {id}", { id });
    if (abort(parseInt(id, 10))) {
      return Response.json({ status: 200, statusText: "OK", id });
    }
    logger.info("Not Found: {id}", { id });
    return Response.json({ status: 404, statusText: "Not Found", id }, {
      status: 404,
      statusText: "Not Found",
    });
  },
};
