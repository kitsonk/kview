import { Partial } from "fresh/runtime";
import type { RouteConfig } from "fresh";

import { LocalStoreContent } from "@/routes/local/[id]/index.tsx";
import { define } from "@/utils/fresh.ts";

export const config: RouteConfig = {
  skipAppWrapper: true,
  skipInheritedLayouts: true,
};

export default define.page(function LocalStorePartial(ctx) {
  const { id } = ctx.params;
  return (
    <Partial name="main">
      <LocalStoreContent id={id} />
    </Partial>
  );
});
