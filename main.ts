import { App, staticFiles } from "fresh";
import type { State } from "@/utils/fresh.ts";
import { getLogger } from "@/utils/log.ts";

const logger = getLogger(["kview", "main"]);

export const app = new App<State>();

app
  .use(
    staticFiles(),
    async function logging(ctx) {
      performance.mark("request-start");
      const res = await ctx.next();
      performance.mark("request-end");
      performance.measure("request-duration", { start: "request-start", end: "request-end" });
      const duration = performance.getEntriesByName("request-duration").pop();
      if (duration) {
        logger.debug("{method} {url} - {status} - {duration}ms", {
          method: ctx.req.method,
          url: ctx.req.url,
          status: res.status,
          duration: duration.duration.toFixed(2),
        });
      }
      return res;
    },
  )
  .fsRoutes();
