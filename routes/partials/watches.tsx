import { Partial } from "fresh/runtime";
import type { RouteConfig } from "fresh";

import { WatchesContent } from "@/routes/watches.tsx";
import { define } from "@/utils/fresh.ts";

export const config: RouteConfig = {
  skipAppWrapper: true,
  skipInheritedLayouts: true,
};

export default define.page(function WatchesPartial(_ctx) {
  return (
    <Partial name="main">
      <WatchesContent />
    </Partial>
  );
});
