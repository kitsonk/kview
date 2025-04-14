import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import svg_minify from "@kitsonk/svg-minify";
import zipBuild from "./zip_build.plugin.ts";

export default defineConfig({
  plugins: [tailwind(), svg_minify(), zipBuild()],
});
