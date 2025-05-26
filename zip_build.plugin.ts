import { type Plugin } from "$fresh/server.ts";
import { assert } from "@std/assert/assert";
import { relative, resolve } from "jsr:@std/path@~1";
import { terminateWorkers, ZipWriter } from "jsr:@zip-js/zip-js@2.7.62";

let buildDir: string = "./_fresh";
const zipFilename = "./_fresh.zip";

async function addDirectories(path: string) {
  const stat = await Deno.stat(path);
  if (stat.isDirectory) {
    const result: string[] = [];
    for await (const entry of Deno.readDir(path)) {
      const stat = await Deno.stat(`${path}/${entry.name}`);
      if (stat.isFile) {
        result.push(`${path}/${entry.name}`);
      } else if (stat.isDirectory) {
        result.push(...(await addDirectories(`${path}/${entry.name}`)));
      }
    }
    return result.flat();
  }
  return [path];
}

export default function zipBuild(): Plugin {
  return {
    name: "zip_build",
    async buildStart(config) {
      buildDir = config.build.outDir;
      try {
        await Deno.remove(zipFilename);
      } catch {
        // just swallow the error
      }
    },
    async buildEnd() {
      const list = (await addDirectories(buildDir)).map((path) => ({
        path,
        relative: relative(buildDir, path),
      }));
      const zipFile = await Deno.open(zipFilename, {
        create: true,
        write: true,
      });
      const zipWriter = new ZipWriter(zipFile, {
        bufferedWrite: true,
        keepOrder: true,
      });
      try {
        for (const { path, relative } of list) {
          try {
            const file = await Deno.open(path);
            await zipWriter.add(relative, file.readable);
          } catch (error) {
            assert(error instanceof Error);
            console.error(`  error: ${error.message}, file: ${path}`);
          }
        }
        await zipWriter.close();
      } finally {
        await terminateWorkers();
      }
      console.log(
        `Build archived to: %c${resolve(Deno.cwd(), zipFilename)}`,
        "color:green",
      );
    },
  };
}
