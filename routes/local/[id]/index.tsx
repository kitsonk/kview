import { encodeBase64Url } from "@std/encoding/base64url";

import { AppFrame } from "@/components/AppFrame.tsx";
import StoreNameEditor from "@/islands/StoreNameEditor.tsx";
import KVExplorer from "@/islands/KVExplorer.tsx";
import { define } from "@/utils/fresh.ts";
import { appState } from "@/utils/state.ts";

export function LocalStoreContent({ id }: { id: string }) {
  const store = appState.localStores.value.find((s) => s.id === id || id === encodeBase64Url(s.id));
  return (
    <>
      <div class="flex items-center justify-between">
        <StoreNameEditor id={id} initialName={store?.name} />
        <div class="breadcrumbs hidden p-0 text-sm sm:inline">
          <ul>
            <li>
              <a href="/local">Local</a>
            </li>
            <li class="opacity-80" title={id}>
              {id.length > 8 ? `${id.slice(0, 4)}…${id.slice(-4)}` : id}
            </li>
          </ul>
        </div>
      </div>
      <KVExplorer storeId={id} />
    </>
  );
}

export default define.page(function Index(ctx) {
  const { id } = ctx.params;
  return (
    <AppFrame>
      <LocalStoreContent id={id} />
    </AppFrame>
  );
});
