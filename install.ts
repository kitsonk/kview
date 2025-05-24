/**
 * Installation script for kview.
 *
 * @example Install kview
 *
 * ```
 * deno -A -r https://kview.deno.dev/install
 * ```
 *
 * @example Upgrade an installation
 *
 * ```
 * deno task upgrade
 * ```
 *
 * @module
 */

import $, { type Path } from "jsr:@david/dax@0.42.0";
import { assert } from "jsr:/@std/assert@~1/assert";
import * as JSONC from "jsr:@std/jsonc@~1";
import { ZipReader } from "jsr:@zip-js/zip-js@2.7.52";

import manifest from "./install.manifest.json" with { type: "json" };

interface DenoConfig {
  name?: string;
  version?: string;
  exports?: Record<string, string>;
  exclude?: string[];
  imports: Record<string, string>;
  lock?: boolean;
  tasks?: Record<string, string>;
}

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

async function getDenoConfig(): Promise<DenoConfig> {
  const res = await fetch(new URL("./deno.json", import.meta.url));
  if (res.status !== 200) {
    throw new Error(
      `Error fetching base deno.json: ${res.status} ${res.statusText}`,
    );
  }
  return JSONC.parse(await res.text()) as unknown as DenoConfig;
}

async function main() {
  const denoConfig = await getDenoConfig();
  $.logStep(`Installing kview (v${denoConfig.version})...`);
  const installLocation = await $.prompt({
    message: "Choose the installation path for kview:",
    default: "kview",
  });
  let installPath = $.path(installLocation);
  if (installPath.isFileSync()) {
    $.logError("ERROR: Install path is a file! Exiting.");
    Deno.exit(1);
  }
  if (installPath.isDirSync()) {
    installPath = await installPath.realPath();
    if (
      !(await $.confirm({
        message: `Install path "${installPath}" already exists. Contents will be removed first. Continue?`,
      }))
    ) {
      $.logWarn("Aborting.");
      Deno.exit(0);
    }
    await installPath.emptyDir();
  } else {
    installPath = await installPath.mkdir();
    $.logStep("Created install directory.");
  }
  $.logStep("Generating config file...");
  denoConfig.tasks = manifest.tasks;
  for (const [key, value] of manifest.mappings) {
    denoConfig.imports[key] = new URL(value, import.meta.url).toString();
  }
  delete denoConfig.name;
  delete denoConfig.version;
  delete denoConfig.exports;
  await installPath.join("deno.json").writeJsonPretty(denoConfig);
  $.logLight("  completed.");
  $.logStep("Write local application files...");
  const progress = $.progress({
    message: "Writing out application files...",
    length: manifest.files.length + manifest.dirs.length,
  });
  await progress.with(async () => {
    for (const dir of manifest.dirs) {
      await installPath.join(dir).mkdir();
      progress.increment();
    }
    for (const item of manifest.files) {
      await $
        .request(new URL(item, import.meta.url))
        .pipeToPath(installPath.join(item));
      progress.increment();
    }
  });
  $.logLight("  complete.");
  await extract(installPath);
  $.logStep("Done.");
  console.log(
    `\n\nInstallation of %ckview%c is complete.\n\nTo start the server, make %c"${installPath}"%c your current directory and execute:\n\n  %cdeno task start\n`,
    "color:green",
    "color:none",
    "color:yellow",
    "color:none",
    "color:gray",
  );
}

main();
