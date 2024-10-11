import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import minify from "./minify.plugin.ts";
import zipBuild from "./zip_build.plugin.ts";

export default defineConfig({
  plugins: [tailwind(), minify(), zipBuild()],
});
