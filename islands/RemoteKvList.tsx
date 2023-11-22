import { AddButton } from "$components/AddButton.tsx";
import { DialogAddUpdateRemote } from "$components/DialogAddUpdateRemote.tsx";
import { RemoteKv } from "$components/RemoteKv.tsx";
import { Toaster } from "$components/Toaster.tsx";
import { useSignal } from "@preact/signals";
import { type RemoteStoreInfo } from "$utils/remoteStores.ts";

export default function RemoteKvList(
  { stores }: { stores: RemoteStoreInfo[] },
) {
  const remoteStores = useSignal(stores);
  const addDialogOpen = useSignal(false);
  const loading = useSignal(false);

  function loadStores() {
    loading.value = true;
    fetch(new URL("/api/remote", import.meta.url)).then((res) => {
      if (res.ok) {
        return res.json().then((body) => remoteStores.value = body);
      }
    }).finally(() => loading.value = false);
  }

  return (
    <>
      <Toaster />
      <DialogAddUpdateRemote open={addDialogOpen} loadStores={loadStores} />
      <div>
        <h1 class="text-xl font-bold py-2">Remote</h1>
        {remoteStores.value.length
          ? (
            <ul class="space-y-2">
              {remoteStores.value.map((db) => <RemoteKv db={db} />)}
            </ul>
          )
          : (
            <div class="w-auto p-8 flex justify-center">
              <div class="italic text-gray(600 dark:400)">
                no remote stores
              </div>
            </div>
          )}
        <div class="w-full my-2 md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
          <AddButton onClick={() => addDialogOpen.value = true}>
            Add remote store
          </AddButton>
        </div>
      </div>
    </>
  );
}
