import { type Signal } from "@preact/signals";
import { type KvLocalInfo } from "$utils/kv.ts";
import { addNotification } from "$utils/state.ts";

import { Dialog } from "./Dialog.tsx";

export function DialogDeleteLocal(
  { open, store }: {
    open: Signal<boolean>;
    store: KvLocalInfo;
  },
) {
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
        Are you sure?
      </h3>
      <p class="mb-4 font-light text-gray-500 dark:text-gray-400">
        Are you sure you want to delete the local info?
      </p>
      <p class="mb-4 font-light text-gray-500 dark:text-gray-400">
        This will not delete the local store, just the connection information in
        kview.
      </p>
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
            const target = "/api/local";
            const body = JSON.stringify(store);
            open.value = false;
            fetch(new URL(target, import.meta.url), {
              body,
              method: "DELETE",
              headers: { "content-type": "application/json" },
            }).then((res) => {
              if (res.ok) {
                globalThis.location.replace(new URL("/local", import.meta.url));
              } else {
                addNotification("Error deleting store info.", "error");
                return res.json().then((err) => console.error(err));
              }
            }).catch((err) => {
              addNotification("Error deleting store info.", "error");
              console.error(err);
            });
          }}
        >
          <svg
            aria-hidden="true"
            class="w-4 h-4 mr-1.5 -ml-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clip-rule="evenodd"
            >
            </path>
          </svg>
          Yes, delete
        </button>
      </div>
    </Dialog>
  );
}
