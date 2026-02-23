import { CardStore } from "./CardStore.tsx";

import type { KvLocalStoreInfo } from "@/utils/kv.ts";

export function ListLocalStores({ localStores }: { localStores: KvLocalStoreInfo[] }) {
  return (
    <div class="grid grid-cols-1 gap-5 md:grid-cols-3 2xl:grid-cols-5 mt-2">
      {localStores.map((store) => <CardStore key={store.id} id={store.id} name={store.name} size={store.size} />)}
    </div>
  );
}
