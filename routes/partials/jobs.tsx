import { Partial } from "fresh/runtime";
import type { RouteConfig } from "fresh";

import { JobsContent } from "@/routes/jobs.tsx";
import { define } from "@/utils/fresh.ts";

export const config: RouteConfig = {
  skipAppWrapper: true,
  skipInheritedLayouts: true,
};

export default define.page(function JobsPartial(_ctx) {
  return (
    <Partial name="main">
      <JobsContent />
    </Partial>
  );
});
