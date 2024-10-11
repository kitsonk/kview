import { type Plugin } from "$fresh/server.ts";
import { optimize } from "npm:svgo@3.0.5";

export default function minify(): Plugin {
  return {
    name: "minify",
    async buildStart(config) {
      const svgString = await Deno.readTextFile("./static/sprites.svg");
      const { data } = optimize(svgString, {
        path: "./static/sprites.svg",
        multipass: true,
      });
      await Deno.writeTextFile(
        `${config.build.outDir}/static/sprites.svg`,
        data,
      );
      console.log(
        "%cSprites have been minified.",
        "color:green;font-weight:bold",
      );
    },
  };
}
