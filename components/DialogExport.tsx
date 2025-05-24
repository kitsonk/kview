import { type KvKeyJSON } from "@deno/kv-utils/json";
import { type Signal, useComputed } from "@preact/signals";
import { keyJsonToPath } from "$utils/kv.ts";

import { CloseButton } from "./CloseButton.tsx";
import { Dialog } from "./Dialog.tsx";
import { KvKey } from "./KvKey.tsx";

export function DialogExport(
  { open, databaseId, prefix }: {
    open: Signal<boolean>;
    databaseId?: string;
    prefix: Signal<KvKeyJSON>;
  },
) {
  const href = useComputed(() => `/api/kv/${databaseId}/_bulk/${keyJsonToPath(prefix.value)}`);

  if (!databaseId) {
    return null;
  }

  return (
    <Dialog
      class="p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5"
      open={open}
    >
      <div class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
        <h3 class="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
          Confirm Export
        </h3>
        <CloseButton onClick={() => open.value = false} />
      </div>
      {prefix.value.length
        ? (
          <>
            <p class="mb-4 font-light text-gray-500 dark:text-gray-400">
              This will download entries as new line delimitated JSON with a prefix of:
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
          class="flex items-center justify-center font-bold text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
          onClick={() => open.value = false}
        >
          Download
        </a>
      </div>
    </Dialog>
  );
}
