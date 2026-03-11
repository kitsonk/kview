import { createBuilder, type InlineConfig } from "vite";
import * as path from "@std/path";

export const FRESH_BUILD_CONFIG = {
  logLevel: "error",
  root: "./",
  build: { emptyOutDir: true },
  environments: {
    ssr: { build: { outDir: path.join("_fresh", "server") } },
    client: { build: { outDir: path.join("_fresh", "client") } },
  },
} satisfies InlineConfig;

export async function buildFreshApp(config: InlineConfig = FRESH_BUILD_CONFIG) {
  const builder = await createBuilder(config);
  await builder.buildApp();
  return await import("../_fresh/server.js");
}

export function startTestServer(app: { default: { fetch: (req: Request) => Promise<Response> } }) {
  const server = Deno.serve({ port: 0, handler: app.default.fetch });

  const { port } = server.addr as Deno.NetAddr;
  const address = `http://localhost:${port}`;

  return { server, address };
}
