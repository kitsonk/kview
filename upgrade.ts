#!/usr/bin/env -S deno run --allow-read --allow-write --allow-net

/**
 * Installation script for kview.
 *
 * @module
 */

import $ from "jsr:@david/dax@0.39.2";
import { parseArgs } from "jsr:@std/cli@0.221.0/parse-args";
import * as JSONC from "jsr:@std/jsonc@0.221.0";

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

const SRC_DENO_JSON = "https://deno.land/x/kview/deno.json";

async function getLatestDenoConfig(): Promise<
  [url: string, config: DenoConfig]
> {
  const res = await fetch(SRC_DENO_JSON);
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
    boolean: ["dry-run"],
  });
  const dryRun = args["dry-run"];
  if ($.path(new URL("./dev.ts", import.meta.url)).isFileSync() && !dryRun) {
    $.logError("Development environment detected. Aborting!");
    Deno.exit(1);
  }
  $.logStep("Fetching latest configuration...");
  const [url, config] = await getLatestDenoConfig();
  $.logLight(`  upgrading to version: ${config.version}`);
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
  $.logStep("Done.");
  console.log(
    `\n\nUpgrade of %ckview%c is complete.`,
    "color:green",
    "color:none",
  );
}

main();
