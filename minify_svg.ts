import { optimize } from "npm:svgo@3.0.5";

const svgString = await Deno.readTextFile("./assets/sprites.svg");
const { data } = optimize(svgString, { path: "./assets/sprites.svg" });
await Deno.writeTextFile("./static/sprites.svg", data);
