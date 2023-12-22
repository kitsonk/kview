import { type RouteContext } from "$fresh/server.ts";
import { setAccessToken } from "$utils/dash.ts";
import { entryToJSON, pathToKey } from "$utils/kv.ts";
import { getKvPath } from "$utils/kv_state.ts";

const encoder = new TextEncoder();

// deno-lint-ignore require-await
export default async function Kv(
  _req: Request,
  { params: { id, path } }: RouteContext,
) {
  const info = getKvPath(id);
  if (!info) {
    return Response.json({ status: 404, statusText: "Not Found" }, {
      status: 404,
      statusText: "Not Found",
    });
  }
  const prefix = path === "" ? [] : pathToKey(path);
  const { path: kvPath, accessToken } = info;
  if (accessToken) {
    setAccessToken(accessToken);
  }
  let kv: Deno.Kv | undefined;
  let cancelled = false;
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      kv = await Deno.openKv(kvPath);
      const iterator = kv.list({ prefix });
      for await (const entry of iterator) {
        if (cancelled) {
          return;
        }
        controller.enqueue(
          encoder.encode(`${JSON.stringify(entryToJSON(entry))}\n`),
        );
      }
      kv.close();
      kv = undefined;
      controller.close();
    },
    cancel(_reason) {
      cancelled = true;
      kv?.close();
      kv = undefined;
    },
  });
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
}
