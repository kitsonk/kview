import { type Handlers } from "$fresh/server.ts";
import { getRootData } from "$utils/dash.ts";

export const handler: Handlers = {
  async GET() {
    const { user: { id } } = await getRootData();
    return new Response("", {
      status: 307,
      statusText: "Temporary Redirect",
      headers: { "Location": `/orgs/${id}` },
    });
  },
};
