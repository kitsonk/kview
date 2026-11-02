import { Partial } from "fresh/runtime";
import type { RouteConfig } from "fresh";

import { LocalContent } from "@/routes/local/index.tsx";
import { define } from "@/utils/fresh.ts";

export const config: RouteConfig = {
  skipAppWrapper: true,
  skipInheritedLayouts: true,
};

export default define.page(function LocalPartial(_ctx) {
  return (
    <Partial name="main">
      <LocalContent />
    </Partial>
  );
});
