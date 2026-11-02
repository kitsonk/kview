import { AppFrame } from "@/components/AppFrame.tsx";
import { define } from "@/utils/fresh.ts";

export function LocalContent() {
  return (
    <>
      <p class="text-lg font-medium">Local</p>
      <p class="text-base-content/70 text-sm">Browse locally registered Deno KV stores.</p>
    </>
  );
}

export default define.page(function Local(_ctx) {
  return (
    <AppFrame>
      <LocalContent />
    </AppFrame>
  );
});
