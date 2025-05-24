import { type Handlers } from "$fresh/server.ts";
import { assert } from "@std/assert/assert";
import { deadline } from "@std/async/deadline";
import { type RemoteStoreInfo } from "$utils/remoteStores.ts";
import { state } from "$utils/state.ts";
import { setAccessToken } from "$utils/dash.ts";

export const handler: Handlers = {
  async POST(res) {
    try {
      const storeInfo: RemoteStoreInfo = await res.json();
      assert(storeInfo.url && storeInfo.accessToken);
      let oldValue: string | undefined;
      if (state.accessToken.peek() !== storeInfo.accessToken) {
        oldValue = state.accessToken.peek();
        setAccessToken(storeInfo.accessToken);
      }
      let kv: Deno.Kv;
      return deadline<Response>(
        Deno.openKv(storeInfo.url).then((k) => {
          kv = k;
          return kv.get(["check"]).then(() => Response.json({ result: "success" }));
        }),
        2000,
      ).catch((err) =>
        Response.json({
          result: "failure",
          reason: err instanceof Error ? `${err.name}: ${err.message}\n\n${err.stack}` : JSON.stringify(err),
        })
      ).finally(() => {
        if (oldValue) {
          setAccessToken(oldValue);
        }
        if (kv) {
          kv.close();
        }
      });
    } catch (err) {
      return Response.json({
        status: 400,
        statusText: "Bad Request",
        error: JSON.stringify(err),
      }, { status: 400, statusText: "Bad Request" });
    }
  },
};
