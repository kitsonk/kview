import { Partial } from "fresh/runtime";
import type { RouteConfig } from "fresh";

import { HomeContent } from "@/routes/index.tsx";
import { define } from "@/utils/fresh.ts";

export const config: RouteConfig = {
  skipAppWrapper: true,
  skipInheritedLayouts: true,
};

export default define.page(function HomePartial(_ctx) {
  return (
    <Partial name="main">
      <HomeContent />
    </Partial>
  );
});
