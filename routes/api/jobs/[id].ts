import { type Handlers } from "$fresh/server.ts";
import { abort, getJob } from "$utils/kv_bulk.ts";

export const handler: Handlers = {
  GET(_req, { params: { id } }) {
    const job = getJob(parseInt(id, 10));
    if (job) {
      return Response.json({ status: 200, statusText: "OK", job });
    }
    return Response.json({ status: 404, statusText: "Not Found", id }, {
      status: 404,
      statusText: "Not Found",
    });
  },
  DELETE(_req, { params: { id } }) {
    if (abort(parseInt(id, 10))) {
      return Response.json({ status: 200, statusText: "OK", id });
    }
    return Response.json({ status: 404, statusText: "Not Found", id }, {
      status: 404,
      statusText: "Not Found",
    });
  },
};
