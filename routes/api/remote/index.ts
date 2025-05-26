import { type Handlers } from "$fresh/server.ts";
import { assert } from "@std/assert/assert";
import { getLogger } from "$utils/logs.ts";
import { deleteRemoteStore, type RemoteStoreInfo, replaceRemoteStore, upsertRemoteStore } from "$utils/remoteStores.ts";
import { state } from "$utils/state.ts";

const logger = getLogger(["kview", "remote", "check"]);

export const handler: Handlers = {
  GET() {
    logger.debug("GET");
    return Response.json(state.remoteStores.value);
  },
  async PUT(req) {
    try {
      const { oldUrl, ...item }: RemoteStoreInfo & { oldUrl?: string } = await req.json();
      logger.debug("PUT: {url}", { url: item.url });
      assert(
        typeof item === "object" && "url" in item && "accessToken" in item,
      );
      state.remoteStores.value = oldUrl
        ? replaceRemoteStore(oldUrl, item, state.remoteStores.value)
        : upsertRemoteStore(
          item,
          state.remoteStores.value,
        );
      return Response.json({ status: 200, statusText: "OK" }, {
        status: 200,
        statusText: "OK",
      });
    } catch (err) {
      return Response.json({
        status: 400,
        statusText: "Bad Request",
        error: JSON.stringify(err),
      }, { status: 400, statusText: "Bad Request" });
    }
  },
  async DELETE(req) {
    try {
      const store: RemoteStoreInfo = await req.json();
      assert(typeof store === "object" && "url" in store);
      logger.debug("DELETE: {url}", { url: store.url });
      state.remoteStores.value = deleteRemoteStore(
        store,
        state.remoteStores.value,
      );
      return Response.json({ status: 200, statusText: "OK" }, {
        status: 200,
        statusText: "OK",
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
