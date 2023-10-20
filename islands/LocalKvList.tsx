import { LocalKv } from "$components/LocalKv.tsx";
import { type KvLocalInfo } from "$utils/kv.ts";

export default function LocalKvList({ stores }: { stores: KvLocalInfo[] }) {
  return (
    <div>
      <h1 class="text-xl font-bold py-2">Local</h1>
      <ul class="space-y-2">
        {stores.map((db) => <LocalKv db={db} />)}
      </ul>
    </div>
  );
}
