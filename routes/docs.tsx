import { AppFrame } from "@/components/AppFrame.tsx";
import { define } from "@/utils/fresh.ts";

export function DocsContent() {
  return (
    <>
      <p class="text-lg font-medium">Documentation</p>
      <p class="text-base-content/70 text-sm">kview documentation.</p>
    </>
  );
}

export default define.page(function Docs(_ctx) {
  return (
    <AppFrame>
      <DocsContent />
    </AppFrame>
  );
});
