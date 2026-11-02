import { Partial } from "fresh/runtime";
import type { RouteConfig } from "fresh";

import { RemoteContent } from "@/routes/remote.tsx";
import { define } from "@/utils/fresh.ts";

export const config: RouteConfig = {
  skipAppWrapper: true,
  skipInheritedLayouts: true,
};

export default define.page(function RemotePartial(_ctx) {
  return (
    <Partial name="main">
      <RemoteContent />
    </Partial>
  );
});
