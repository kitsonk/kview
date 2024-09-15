import { type Handlers } from "$fresh/server.ts";
import { pathToKey } from "$utils/kv.ts";
import { getKv } from "$utils/kv_state.ts";

export const handler: Handlers = {
  async GET(_req, { params: { id, path } }) {
    const key = path === "" ? [] : pathToKey(path);
    const kv = await getKv(id);
    return kv.getAsBlob(key, { response: true });
  },
};
