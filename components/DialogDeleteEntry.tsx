import { asset } from "$fresh/runtime.ts";
import { type BlobMeta } from "@kitsonk/kv-toolbox/blob";
import { type KvEntryJSON, type KvKeyJSON } from "@deno/kv-utils/json";
import { type Signal } from "@preact/signals";
import { keyJsonToPath } from "$utils/kv.ts";
import { assert } from "@std/assert/assert";
import { addNotification } from "$utils/state.ts";

import { Dialog } from "./Dialog.tsx";
import { KvKey } from "./KvKey.tsx";

export function DialogDeleteEntry(
  { open, entry, databaseId, loadValue, loadKeys }: {
    open: Signal<boolean>;
    entry: Signal<
      | { key: KvKeyJSON; versionstamp?: undefined; value?: undefined }
      | KvEntryJSON
      | { key: KvKeyJSON; versionstamp: string; meta: BlobMeta }
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
  return (
    <Dialog
      class="p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5"
      open={open}
    >
      <button
        type="button"
        class="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
        onClick={() => open.value = false}
      >
        <svg
          aria-hidden="true"
          class="w-5 h-5"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <use href={`${asset("/sprites.svg")}#close`} />
        </svg>
        <span class="sr-only">Close modal</span>
      </button>
      <h3 class="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
        Are you sure?
      </h3>
      <p class="mb-4 font-light text-gray-500 dark:text-gray-400">
        You are about to delete the entry with a key of:
      </p>
      <div class="mb-4">
        <KvKey value={entry.value.key} noLink />
      </div>
      <div class="flex items-center space-x-4">
        <button
          data-modal-toggle="deleteListModal"
          type="button"
          class="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
          onClick={() => open.value = false}
        >
          No, cancel
        </button>
        <button
          type="submit"
          class="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
          onClick={() => {
            assert(entry.value);
            const target = `/api/kv/${databaseId}/${
              keyJsonToPath(entry.value.key)
            }${"meta" in entry.value ? "?blob" : ""}`;
            const body = JSON.stringify({
              versionstamp: entry.value.versionstamp,
            });
            open.value = false;
            fetch(new URL(target, import.meta.url), {
              body,
              method: "DELETE",
              headers: { "content-type": "application/json" },
            }).then((res) => {
              if (!res.ok) {
                if (res.status === 409) {
                  addNotification("Entry has changed. Delete failed.", "error");
                } else {
                  addNotification("Error deleting entry.", "error");
                  return res.json().then((err) => console.error(err));
                }
              } else {
                addNotification("Entry successfully deleted.", "success", true);
                loadKeys();
              }
              loadValue();
            }).catch((err) => {
              addNotification("Error deleting value.", "error");
              console.error(err);
            });
          }}
        >
          <svg
            aria-hidden="true"
            class="w-4 h-4 mr-1.5 -ml-1"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <use href={`${asset("/sprites.svg")}#trash_sm`} />
          </svg>
          Yes, delete
        </button>
      </div>
    </Dialog>
  );
}
