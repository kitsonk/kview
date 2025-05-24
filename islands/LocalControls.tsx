import { DialogAddUpdateLocal } from "../components/DialogAddUpdateLocal.tsx";
import { DialogDeleteLocal } from "$components/DialogDeleteLocal.tsx";
import { useSignal } from "@preact/signals";
import { type KvLocalInfo } from "$utils/kv.ts";

export default function LocalControls({ store }: { store: KvLocalInfo }) {
  const isSpecified = store.id === store.path;
  const updateOpen = useSignal(false);
  const deleteOpen = useSignal(false);

  return (
    <>
      <DialogAddUpdateLocal open={updateOpen} store={store} />
      {isSpecified ? <DialogDeleteLocal open={deleteOpen} store={store} /> : undefined}
      <div class="flex flex-col md:px-16">
        <button
          type="button"
          class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-bold rounded-lg text-sm px-5 py-2.5 me-2 my-1 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
          onClick={() => updateOpen.value = true}
        >
          Update local info
        </button>
        {isSpecified
          ? (
            <button
              type="button"
              class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-bold rounded-lg text-sm px-5 py-2.5 me-2 my-1 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
              onClick={() => deleteOpen.value = true}
            >
              Delete local info
            </button>
          )
          : undefined}
      </div>
    </>
  );
}
