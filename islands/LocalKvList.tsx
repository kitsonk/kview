import { LocalKv } from "$components/LocalKv.tsx";
import { state } from "$utils/state.ts";

export default function LocalKvList() {
  if (!state.localStores.value) {
    return null;
  }
  return (
    <div>
      <h1 class="text-xl font-bold py-2">Local</h1>
      <ul class="space-y-2">
        {state.localStores.value.map((db) => <LocalKv db={db} />)}
      </ul>
    </div>
  );
}
