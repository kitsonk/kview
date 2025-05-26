import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";

const port = Deno.env.has("PORT") ? parseInt(Deno.env.get("PORT")!, 10) : undefined;

export default defineConfig({
  server: { port },
  plugins: [tailwind()],
});
