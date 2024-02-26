import { type Handlers } from "$fresh/server.ts";
import { pathToKey } from "$utils/kv.ts";
import { exportNdJson, importNdJson } from "$utils/kv_bulk.ts";

export const handler: Handlers = {
  GET(_req, { params: { id, path } }) {
    const prefix = path === "" ? [] : pathToKey(path);
    const body = exportNdJson(id, prefix);
    if (!body) {
      return Response.json({ status: 404, statusText: "Not Found" }, {
        status: 404,
        statusText: "Not Found",
      });
    }

    return new Response(
      body,
      {
        status: 200,
        statusText: "OK",
        headers: {
          "content-type": "application/x-ndjson",
          "content-disposition": `attachment; filename="${id}.ndjson"`,
        },
      },
    );
  },
  async POST(req, { params: { id, path } }) {
    const prefix = path === "" ? [] : pathToKey(path);
    if (!req.body) {
      return Response.json({ status: 400, statusText: "Bad Request" }, {
        status: 400,
        statusText: "Bad Request",
      });
    }
    const overwrite = req.headers.has("kview-overwrite");
    const name = req.headers.get("kview-name");
    const href = req.headers.get("kview-href");
    const blob = await req.blob();
    const job = importNdJson(id, prefix, blob, {
      overwrite,
      name,
      href,
    });
    if (!job) {
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
