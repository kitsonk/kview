import { AppFrame } from "@/components/AppFrame.tsx";
import { define } from "@/utils/fresh.ts";

export function JobsContent() {
  return (
    <>
      <p class="text-lg font-medium">Jobs</p>
      <p class="text-base-content/70 text-sm">View background jobs.</p>
    </>
  );
}

export default define.page(function Jobs(_ctx) {
  return (
    <AppFrame>
      <JobsContent />
    </AppFrame>
  );
});
