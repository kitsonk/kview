import { configure, getConsoleSink, getLogger } from "@logtape/logtape";

const logger = getLogger("kview");

globalThis.addEventListener("unhandledrejection", (event) => {
  event.preventDefault();
  logger.error("Unhandled rejection\n{error}", {
    error: event.reason instanceof Error ? event.reason.stack : "[Unknown Error]",
  });
});

globalThis.addEventListener("error", (event) => {
  event.preventDefault();
  logger.error("Unhandled error\n{error}", {
    error: event.error instanceof Error ? event.error.stack : "[Unknown Error]",
  });
});

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
