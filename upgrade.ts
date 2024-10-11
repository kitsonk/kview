#!/usr/bin/env -S deno run --allow-read --allow-write --allow-net

/**
 * Installation script for kview.
 *
 * @module
 */

import $, { type Path } from "jsr:@david/dax@0.42.0";
import { assert } from "jsr:/@std/assert@~1/assert";
import { parseArgs } from "jsr:@std/cli@~1/parse-args";
import * as JSONC from "jsr:@std/jsonc@~1";
import { ZipReader } from "jsr:@zip-js/zip-js@2.7.52";

interface DenoConfig {
  version?: string;
  exclude?: string[];
  imports: Record<string, string>;
  lock?: boolean;
  tasks?: Record<string, string>;
}

interface Manifest {
  tasks: Record<string, string>;
  mappings: [string, string][];
  dirs: string[];
  files: string[];
}

const LATEST_DENO_JSON = "https://deno.land/x/kview/deno.json";
const PREVIEW_DENO_JSON =
  "https://raw.githubusercontent.com/kitsonk/kview/main/deno.json";
const EXTRACT_PATH = "./_fresh";

async function extract(installPath: Path) {
  $.logStep("Extracting build files...");
  const zipFilePath = installPath.join("_fresh.zip");
  const zipFile = await zipFilePath.open({ read: true });
  const reader = new ZipReader(zipFile);
  const extractPath = installPath.join(EXTRACT_PATH);
  if (await extractPath.exists()) {
    await extractPath.emptyDir();
  }
  const entries = await reader.getEntries();
  const progress = $.progress({
    message: "Extracting build files...",
    length: entries.length,
  });
  await progress.with(async () => {
    for (const entry of entries) {
      if (entry.getData) {
        const file = extractPath.join(entry.filename);
        await file.parent()?.mkdir({ recursive: true });
        try {
          const outFile = await file.open({ create: true, write: true });
          await entry.getData(outFile.writable);
        } catch (error) {
          assert(error instanceof Error);
          console.error(
            `  error: ${error.message}, file: ${await file.realPath()}`,
          );
        }
      }
      progress.increment();
    }
  });
  await reader.close();
  await zipFilePath.remove();
  $.logLight("  complete.");
}

async function getLatestDenoConfig(preview: boolean): Promise<
  [url: string, config: DenoConfig]
> {
  const res = await fetch(preview ? PREVIEW_DENO_JSON : LATEST_DENO_JSON);
  if (!res.ok) {
    throw new Error(
      `Error fetching latest deno.json: ${res.status} ${res.statusText}`,
    );
  }
  return [res.url, JSONC.parse(await res.text()) as unknown as DenoConfig];
}

async function main() {
  $.logStep(`Upgrading kview...`);
  const args = parseArgs(Deno.args, {
    boolean: ["dry-run", "preview"],
  });
  const dryRun = args["dry-run"];
  const preview = args["preview"];
  if ($.path(new URL("./dev.ts", import.meta.url)).isFileSync() && !dryRun) {
    $.logError("Development environment detected. Aborting!");
    Deno.exit(1);
  }
  $.logStep("Fetching latest configuration...");
  const [url, config] = await getLatestDenoConfig(preview);
  $.logLight(
    `  upgrading to version: ${config.version} ${preview ? "(preview)" : ""}`,
  );
  $.logStep("Updating config file...");
  const cwd = $.path(new URL(".", import.meta.url));
  const localConfig = JSONC.parse(
    await cwd.join("deno.json").readText(),
  ) as unknown as DenoConfig;
  for (const [key, value] of Object.entries(config.imports)) {
    localConfig.imports[key] = value;
  }
  const manifest: Manifest = await $.request(
    new URL("./install.manifest.json", url),
  )
    .json();
  for (const [key, value] of manifest.mappings) {
    localConfig.imports[key] = new URL(value, url).toString();
  }
  localConfig.tasks = manifest.tasks;
  if (dryRun) {
    console.log(localConfig);
  } else {
    await cwd.join("deno.json").writeJsonPretty(localConfig);
  }
  $.logLight("  complete.");
  $.logStep("Updating local application files...");
  const progress = $.progress({
    message: "Updating application files...",
    length: manifest.dirs.length + manifest.files.length,
  });
  await progress.with(async () => {
    for (const dir of manifest.dirs) {
      await cwd.join(dir).mkdir({ recursive: true });
      progress.increment();
    }
    for (const item of manifest.files) {
      const req = $.request(new URL(item, url));
      if (dryRun) {
        if (!(await req).ok) {
          $.logError(`Unable to fetch: ${item}`);
        }
      } else {
        await req.pipeToPath(cwd.join(item));
      }
      progress.increment();
    }
  });
  $.logLight("  complete.");
  await extract(cwd);
  $.logStep("Done.");
  console.log(
    `\n\nUpgrade of %ckview%c is complete.`,
    "color:green",
    "color:none",
  );
}

main();
