import type { Context } from "fresh";
import type { State } from "@/utils/fresh.ts";
import { getLogger } from "@/utils/log.ts";

const logger = getLogger(["kview"]);

export default function middleware(): (ctx: Context<State>) => Promise<Response> {
  return async function logging(ctx: Context<State>): Promise<Response> {
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
  };
}
