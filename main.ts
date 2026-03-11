import { App, staticFiles } from "fresh";
import logging from "@/middleware/logging.ts";
import type { State } from "@/utils/fresh.ts";

export const app = new App<State>();

app
  .use(staticFiles(), logging())
  .fsRoutes();
