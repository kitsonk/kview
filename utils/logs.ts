import { configure, getConsoleSink, getLogger } from "@logtape/logtape";

await configure({
  sinks: { console: getConsoleSink() },
  loggers: [
    { category: "kview", lowestLevel: "debug", sinks: ["console"] },
    // Log meta information at a lower level to avoid spamming the console.
    { category: ["logtape", "meta"], lowestLevel: "warning", sinks: ["console"] },
  ],
});

export { getLogger };
