import "@std/dotenv/load";
import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import svg_minify from "@kitsonk/svg-minify";
import zipBuild from "./zip_build.plugin.ts";

const port = Deno.env.has("PORT") ? parseInt(Deno.env.get("PORT")!, 10) : undefined;

export default defineConfig({
  server: { port },
  plugins: [tailwind(), svg_minify(), zipBuild()],
});
