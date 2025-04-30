import { AddButton } from "$components/AddButton.tsx";
import { DialogAddUpdateLocal } from "../components/DialogAddUpdateLocal.tsx";
import { LocalKv } from "$components/LocalKv.tsx";
import { useSignal } from "@preact/signals";
import { type KvLocalInfo } from "$utils/kv.ts";

export default function LocalKvList(
  { stores }: { stores?: KvLocalInfo[] | undefined },
) {
  const addDialogOpen = useSignal(false);

  if (!stores) {
    return null;
  }

  return (
    <>
      <DialogAddUpdateLocal open={addDialogOpen} />
      <div>
        <h1 class="text-xl font-bold py-2">Local</h1>
        <ul class="space-y-2">
          {stores.map((db, idx) => <LocalKv key={idx} db={db} />)}
        </ul>
        <div class="w-full my-2 md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
          <AddButton onClick={() => addDialogOpen.value = true}>
            Add local store
          </AddButton>
        </div>
      </div>
    </>
  );
}
