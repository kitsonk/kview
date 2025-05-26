import "@std/dotenv/load";
import { configure, getConsoleSink, getLogger } from "@logtape/logtape";

const lowestLevel = (Deno.env.get("LOG_LEVEL") ?? "debug") as "debug" | "info" | "warning" | "error" | "fatal";

await configure({
  sinks: { console: getConsoleSink() },
  loggers: [
    { category: "kview", lowestLevel, sinks: ["console"] },
    // Log meta information at a lower level to avoid spamming the console.
    { category: ["logtape", "meta"], lowestLevel: "warning", sinks: ["console"] },
  ],
});

export { getLogger };
