import { Partial } from "fresh/runtime";
import type { RouteConfig } from "fresh";

import { OrgContent } from "@/routes/org/[name].tsx";
import { define } from "@/utils/fresh.ts";

export const config: RouteConfig = {
  skipAppWrapper: true,
  skipInheritedLayouts: true,
};

export default define.page(function OrgPartial(ctx) {
  const { name } = ctx.params;
  return (
    <Partial name="main">
      <OrgContent name={name} />
    </Partial>
  );
});
