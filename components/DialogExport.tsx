import { type Signal, useComputed } from "@preact/signals";
import { keyJsonToPath } from "$utils/kv.ts";
import type { KvKeyJSON } from "$utils/kv_json.ts";

import { Dialog } from "./Dialog.tsx";
import { KvKey } from "./KvKey.tsx";

export function DialogExport(
  { open, databaseId, prefix }: {
    open: Signal<boolean>;
    databaseId?: string;
    prefix: Signal<KvKeyJSON>;
  },
) {
  if (!databaseId) {
    return null;
  }

  const href = useComputed(() =>
    `/api/kv/${databaseId}/_bulk/${keyJsonToPath(prefix.value)}`
  );

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
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          >
          </path>
        </svg>
        <span class="sr-only">Close modal</span>
      </button>
      <h3 class="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
        Confirm Export
      </h3>
      {prefix.value.length
        ? (
          <>
            <p class="mb-4 font-light text-gray-500 dark:text-gray-400">
              This will download entries as new line delimitated JSON with a
              prefix of:
            </p>
            <div class="border rounded p-2 dark:bg-gray-900 m-2">
              <KvKey value={prefix} noLink />
            </div>
          </>
        )
        : (
          <p class="mb-4 font-light text-gray-500 dark:text-gray-400">
            This will download all the entries as new line delimitated JSON.
          </p>
        )}
      <p class="my-4 font-light text-gray-500 dark:text-gray-400">
        See the documentation for further details.
      </p>
      <div class="flex items-center space-x-4">
        <button
          data-modal-toggle="deleteListModal"
          type="button"
          class="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
          onClick={() => open.value = false}
        >
          Cancel
        </button>
        <a
          href={href}
          class="flex items-center justify-center font-bold text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
          onClick={() => open.value = false}
        >
          Download
        </a>
      </div>
    </Dialog>
  );
}
