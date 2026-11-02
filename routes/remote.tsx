import { AppFrame } from "@/components/AppFrame.tsx";
import { define } from "@/utils/fresh.ts";

export function RemoteContent() {
  return (
    <>
      <p class="text-lg font-medium">Remote</p>
      <p class="text-base-content/70 text-sm">Browse remote Deno KV stores.</p>
    </>
  );
}

export default define.page(function Remote(_ctx) {
  return (
    <AppFrame>
      <RemoteContent />
    </AppFrame>
  );
});
