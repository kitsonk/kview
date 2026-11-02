import { Partial } from "fresh/runtime";
import type { RouteConfig } from "fresh";

import { DocsContent } from "@/routes/docs.tsx";
import { define } from "@/utils/fresh.ts";

export const config: RouteConfig = {
  skipAppWrapper: true,
  skipInheritedLayouts: true,
};

export default define.page(function DocsPartial(_ctx) {
  return (
    <Partial name="main">
      <DocsContent />
    </Partial>
  );
});
