import { AppFrame } from "@/components/AppFrame.tsx";
import { define } from "@/utils/fresh.ts";

export function WatchesContent() {
  return (
    <>
      <p class="text-lg font-medium">Watches</p>
      <p class="text-base-content/70 text-sm">View registered KV watches.</p>
    </>
  );
}

export default define.page(function Watches(_ctx) {
  return (
    <AppFrame>
      <WatchesContent />
    </AppFrame>
  );
});
