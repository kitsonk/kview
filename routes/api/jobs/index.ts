import { type Handlers } from "$fresh/server.ts";
import { getJobs } from "$utils/kv_bulk.ts";
import { getLogger } from "$utils/logs.ts";

const logger = getLogger(["kview", "api", "jobs"]);

export const handler: Handlers = {
  GET(_req, _ctx) {
    logger.debug("GET");
    return Response.json({ status: 200, statusText: "OK", jobs: getJobs() });
  },
};
