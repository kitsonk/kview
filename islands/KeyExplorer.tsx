import { KvKey } from "$components/KvKey.tsx";
import { KvKeyList } from "$components/KvKeyList.tsx";
import { KvEntry } from "$components/KvEntry.tsx";
import { Loader } from "$components/Loader.tsx";
import { useSignal, useSignalEffect } from "@preact/signals";
import { DashDb, DashProject } from "$utils/dash.ts";
import {
  keyPartJsonToPath,
  type KvEntryJSON,
  type KvKeyJSON,
} from "$utils/kv.ts";

export default function KeyExplorer(
  { db: { databaseId } }: { db: DashDb; project: DashProject },
) {
  const currentKey = useSignal<KvKeyJSON>([]);
  const loadingKeys = useSignal(false);
  const list = useSignal<{ key: KvKeyJSON; count: number }[]>([]);
  let keyController: AbortController | undefined;

  useSignalEffect(() => {
    const target = `/api/kv/${databaseId}/${
      keyPartJsonToPath(currentKey.value)
    }`;
    loadingKeys.value = true;
    if (keyController) {
      keyController.abort();
    }
    keyController = new AbortController();
    const { signal } = keyController;
    fetch(new URL(target, import.meta.url), { signal })
      .then((res) => {
        if (res.status === 200) {
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
  });

  const currentEntryKey = useSignal<KvKeyJSON | null>(null);
  const loadingEntry = useSignal(false);
  const currentEntry = useSignal<{ key: KvKeyJSON } | KvEntryJSON | null>(null);
  let entryController: AbortController | undefined;

  useSignalEffect(() => {
    currentEntry.value = null;
    if (currentEntryKey.value === null) {
      return;
    }
    const target = `/api/kv/${databaseId}/${
      keyPartJsonToPath(currentEntryKey.value)
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
  });

  return (
    <>
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
      </div>
      {loadingEntry.value
        ? (
          <div class="border rounded p-2 col-span-2 flex items-center justify-center">
            <Loader />
          </div>
        )
        : <KvEntry entry={currentEntry} />}
    </>
  );
}
