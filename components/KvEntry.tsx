import { type BlobMeta } from "@kitsonk/kv-toolbox/blob";
import { type KvEntryJSON, type KvKeyJSON } from "@kitsonk/kv-toolbox/json";
import { type Signal, useComputed, useSignal } from "@preact/signals";
import { isEditable } from "$utils/kv.ts";
import { addNotification } from "$utils/state.ts";

import { DialogAddEntry } from "./DialogAddEntry.tsx";
import { DialogDeleteEntry } from "./DialogDeleteEntry.tsx";
import { DialogEditValue } from "./DialogEditValue.tsx";
import { KvKey } from "./KvKey.tsx";
import { KvValue } from "./KvValue.tsx";
import IconObserve from "./icons/Observe.tsx";

async function watchEntry(
  databaseId: string,
  key: KvKeyJSON,
  name?: string,
  href?: string,
) {
  const res = await fetch(new URL("/api/watch", import.meta.url), {
    method: "PUT",
    body: JSON.stringify({ databaseId, key, name, href }),
    headers: {
      "content-type": "application/json",
    },
  });
  if (res.ok) {
    addNotification("Watch added.", "success", true);
  } else {
    addNotification("Error adding watch.", "error", true);
    console.error(
      `Status: ${res.status} ${res.statusText}\n\n${await res.text()}`,
    );
  }
}

export function KvEntry(
  { entry, loadValue, loadKeys, databaseId, name, href }: {
    entry: Signal<
      | {
        key: KvKeyJSON;
        versionstamp?: undefined;
        value?: undefined;
        meta?: undefined;
      }
      | (KvEntryJSON & { meta?: undefined })
      | {
        key: KvKeyJSON;
        versionstamp?: undefined;
        value?: undefined;
        meta: BlobMeta;
      }
      | null
    >;
    databaseId?: string;
    name?: string;
    href?: string;
    loadValue(): void;
    loadKeys(): void;
  },
) {
  if (!entry.value) {
    return null;
  }
  const { versionstamp, value, meta } = entry.value;
  const editable = isEditable(value);
  const editDialogOpen = useSignal(false);
  const addEntryDialogOpen = useSignal(false);
  const deleteEntryDialogOpen = useSignal(false);
  const currentKey = useComputed(() => entry.value?.key);
  return (
    <>
      {editable && (
        <DialogEditValue
          open={editDialogOpen}
          entry={entry}
          databaseId={databaseId}
          loadValue={loadValue}
        />
      )}
      <DialogAddEntry
        open={addEntryDialogOpen}
        currentKey={currentKey}
        databaseId={databaseId}
        loadKeys={loadKeys}
        subEntry
      />
      <DialogDeleteEntry
        open={deleteEntryDialogOpen}
        entry={entry}
        databaseId={databaseId}
        loadValue={loadValue}
        loadKeys={loadKeys}
      />
      <div class="border rounded p-2 lg:col-span-2">
        <div class="flex">
          <h2 class="font-bold my-2 flex-grow">Key</h2>
          {databaseId && !("meta" in entry.value)
            ? (
              <button
                type="button"
                class="flex-none text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
                onClick={() =>
                  watchEntry(databaseId, entry.value!.key, name, href)}
              >
                <IconObserve size={4} />
              </button>
            )
            : undefined}
        </div>
        <KvKey value={currentKey} />
        {value || meta
          ? (
            <>
              <KvValue value={value} meta={meta} />
              {versionstamp && (
                <div class="text-sm text-gray(600 dark:400) p-1 italic">
                  Version: {versionstamp}
                </div>
              )}
            </>
          )
          : (
            <div class="w-auto p-8 flex justify-center">
              <div class="italic text-gray(600 dark:400)">
                no value
              </div>
            </div>
          )}
        <div class="w-full my-2 md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
          {(!value || editable) && (
            <button
              class="flex items-center justify-center font-bold text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
              type="button"
              onClick={() => editDialogOpen.value = true}
            >
              {value ? "Edit value" : "Add value"}
            </button>
          )}
          {value || meta
            ? (
              <>
                <button
                  class="flex items-center justify-center font-bold text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                  type="button"
                  onClick={() => addEntryDialogOpen.value = true}
                >
                  Add sub-entry
                </button>
                <button
                  class="flex items-center justify-center font-bold text-white bg-primary-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                  type="button"
                  onClick={() => deleteEntryDialogOpen.value = true}
                >
                  Delete entry
                </button>
              </>
            )
            : undefined}
        </div>
      </div>
    </>
  );
}
