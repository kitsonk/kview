import { AppFrame } from "@/components/AppFrame.tsx";
import { define } from "@/utils/fresh.ts";

export function OrgContent({ name }: { name: string }) {
  return (
    <>
      <p class="text-lg font-medium">Organization: {name}</p>
      <p class="text-base-content/70 text-sm">Browse KV stores for the {name} organization on Deno Deploy.</p>
    </>
  );
}

export default define.page(function Org(ctx) {
  const { name } = ctx.params;
  return (
    <AppFrame>
      <OrgContent name={name} />
    </AppFrame>
  );
});
