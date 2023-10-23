#!/usr/bin/env -S deno run --allow-read --allow-write --allow-net

import $ from "https://deno.land/x/dax@0.35.0/mod.ts";
import * as JSONC from "https://deno.land/std@0.203.0/jsonc/mod.ts";

import manifest from "./install.manifest.json" assert { type: "json" };

interface DenoConfig {
  exclude?: string[];
  imports: Record<string, string>;
  lock?: boolean;
  tasks?: Record<string, string>;
}

const TASKS = {
  "start": "deno run -A --unstable main.ts",
};

const IMPORT_MAP_ENTRIES: [string, string][] = [
  ["$components/", "./components/"],
  ["$islands/", "./islands/"],
  ["$utils/", "./utils/"],
  ["./islands/", "./islands/"],
  ["./routes/", "./routes/"],
];

async function getDenoConfig(): Promise<DenoConfig> {
  const res = await fetch(new URL("./deno.json", import.meta.url));
  if (res.status !== 200) {
    throw new Error(
      `Error fetching base deno.json: ${res.status} ${res.statusText}`,
    );
  }
  return JSONC.parse(await res.text());
}

async function main() {
  $.logStep("Installing kview...");
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
        message:
          `Install path "${installPath}" already exists. Contents will be removed first. Continue?`,
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
  const denoConfig = await getDenoConfig();
  denoConfig.tasks = TASKS;
  for (const [key, value] of IMPORT_MAP_ENTRIES) {
    denoConfig.imports[key] = (new URL(value, import.meta.url)).toString();
  }
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
