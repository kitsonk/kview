import { type Signal, useSignal } from "@preact/signals";
import { isEditable, type KvEntryJSON, type KvKeyJSON } from "$utils/kv.ts";

import { DialogAddEntry } from "./DialogAddEntry.tsx";
import { DialogDeleteEntry } from "./DialogDeleteEntry.tsx";
import { DialogEditValue } from "./DialogEditValue.tsx";
import { KvKey } from "./KvKey.tsx";
import { KvValue } from "./KvValue.tsx";

export function KvEntry(
  { entry, loadValue, loadKeys, databaseId }: {
    entry: Signal<
      | { key: KvKeyJSON; versionstamp?: undefined; value?: undefined }
      | KvEntryJSON
      | null
    >;
    databaseId?: string;
    loadValue(): void;
    loadKeys(): void;
  },
) {
  if (!entry.value) {
    return null;
  }
  const { key, versionstamp, value } = entry.value;
  const editable = isEditable(value);
  const editDialogOpen = useSignal(false);
  const addEntryDialogOpen = useSignal(false);
  const deleteEntryDialogOpen = useSignal(false);
  const currentKey = useSignal(key);
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
        <h2 class="font-bold mb-2">Key</h2>
        <KvKey value={key} />
        {value
          ? (
            <>
              <KvValue value={value} />
              <div class="text-sm text-gray(600 dark:400) p-1 italic">
                Version: {versionstamp}
              </div>
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
          {value
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
