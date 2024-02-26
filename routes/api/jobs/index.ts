import { type Handlers } from "$fresh/server.ts";
import { getJobs } from "$utils/kv_bulk.ts";

export const handler: Handlers = {
  GET(_req, _ctx) {
    return Response.json({ status: 200, statusText: "OK", jobs: getJobs() });
  },
};
