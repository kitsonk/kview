import { AddButton } from "$components/AddButton.tsx";
import { DialogAddEntry } from "$components/DialogAddEntry.tsx";
import { DialogDeleteEntries } from "$components/DialogDeleteEntries.tsx";
import { DialogExport } from "$components/DialogExport.tsx";
import { DialogImport } from "$components/DialogImport.tsx";
import { KvKey } from "$components/KvKey.tsx";
import { KvKeyList } from "$components/KvKeyList.tsx";
import { KvEntry } from "$components/KvEntry.tsx";
import { Loader } from "$components/Loader.tsx";
import { Toaster } from "$components/Toaster.tsx";
import { useSignal, useSignalEffect } from "@preact/signals";
import { DashDb } from "$utils/dash.ts";
import { keyJsonToPath } from "$utils/kv.ts";
import { type KvEntryJSON, type KvKeyJSON } from "@kitsonk/kv-toolbox/json";

export default function KvExplorer(
  { db, id, label, href }: {
    db?: DashDb;
    id?: string;
    label?: string;
    href?: string;
  },
) {
  const currentKey = useSignal<KvKeyJSON>([]);
  const loadingKeys = useSignal(false);
  const addDialogOpen = useSignal(false);
  const exportOpen = useSignal(false);
  const importOpen = useSignal(false);
  const deleteEntiresOpen = useSignal(false);
  const list = useSignal<{ key: KvKeyJSON; count: number }[]>([]);
  let keyController: AbortController | undefined;
  const databaseId = db?.databaseId ?? id;
  function loadKeys() {
    const target = `/api/kv/${databaseId}/${keyJsonToPath(currentKey.value)}`;
    loadingKeys.value = true;
    if (keyController) {
      keyController.abort();
    }
    keyController = new AbortController();
    const { signal } = keyController;
    fetch(new URL(target, import.meta.url), { signal })
      .then((res) => {
        if (res.ok) {
          return res.json().then((data) => list.value = data);
        }
        console.error(
          `Unable to fetch keys: ${res.status} ${res.statusText}`,
        );
        return res.text().then((data) =>
          console.error(`Response body:\n\n${data}`)
        );
      }).finally(() => {
        loadingKeys.value = false;
        keyController = undefined;
      });
  }

  useSignalEffect(loadKeys);

  const currentEntryKey = useSignal<KvKeyJSON | null>(null);
  const loadingEntry = useSignal(false);
  const currentEntry = useSignal<{ key: KvKeyJSON } | KvEntryJSON | null>(null);
  let entryController: AbortController | undefined;

  function loadValue() {
    currentEntry.value = null;
    if (currentEntryKey.value === null) {
      return;
    }
    const target = `/api/kv/${databaseId}/${
      keyJsonToPath(currentEntryKey.value)
    }?entry`;
    loadingEntry.value = true;
    if (entryController) {
      entryController.abort();
    }
    entryController = new AbortController();
    const { signal } = entryController;
    fetch(new URL(target, import.meta.url), { signal }).then((res) => {
      if (res.status === 200) {
        return res.json().then((data) => currentEntry.value = data);
      }
      if (res.status === 404) {
        if (currentEntryKey.value) {
          currentEntry.value = { key: [...currentEntryKey.value] };
        }
        return;
      }
      console.error(`Unable to fetch entry: ${res.status} ${res.statusText}`);
      return res.text().then((data) =>
        console.error(`Response body:\n\n${data}`)
      );
    }).finally(() => {
      loadingEntry.value = false;
      keyController = undefined;
    });
  }

  useSignalEffect(loadValue);

  return (
    <>
      <Toaster />
      <DialogAddEntry
        open={addDialogOpen}
        currentKey={currentKey}
        loadKeys={loadKeys}
        databaseId={databaseId}
      />
      <DialogExport
        open={exportOpen}
        databaseId={databaseId}
        prefix={currentKey}
      />
      <DialogImport
        open={importOpen}
        databaseId={databaseId}
        prefix={currentKey}
        name={label}
        href={href}
      />
      <DialogDeleteEntries
        open={deleteEntiresOpen}
        databaseId={databaseId}
        prefix={currentKey}
        loadKeys={loadKeys}
      />
      <div class="border rounded p-2">
        <h2 class="font-bold mb-2">Path</h2>
        <KvKey value={currentKey} entry={currentEntryKey} showRoot />
        <h2 class="font-bold my-2">Keys</h2>
        {loadingKeys.value
          ? (
            <div class="h(48 md:64 lg:72 xl:96) bg-gray(100 dark:800) rounded flex items-center justify-center">
              <Loader />
            </div>
          )
          : (
            <KvKeyList
              list={list}
              currentKey={currentKey}
              currentEntryKey={currentEntryKey}
            />
          )}
        <div class="w-full my-2 md:w-auto flex flex-col md:flex-wrap md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
          <button
            type="button"
            class="flex items-center justify-center font-bold text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800 md:m-1"
            onClick={() => importOpen.value = true}
          >
            Import...
          </button>
          <button
            type="button"
            class="flex items-center justify-center font-bold text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800 md:m-2"
            onClick={() => exportOpen.value = true}
          >
            Export...
          </button>
          <button
            type="button"
            class="flex items-center justify-center font-bold text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800 md:m-2"
            onClick={() => deleteEntiresOpen.value = true}
          >
            Delete...
          </button>
          <AddButton class="md:m-2" onClick={() => addDialogOpen.value = true}>
            Add entry...
          </AddButton>
        </div>
      </div>
      {loadingEntry.value
        ? (
          <div class="border rounded p-2 col-span-2 flex items-center justify-center">
            <Loader />
          </div>
        )
        : (
          <KvEntry
            entry={currentEntry}
            databaseId={databaseId}
            name={label}
            href={href}
            loadKeys={loadKeys}
            loadValue={loadValue}
          />
        )}
    </>
  );
}
