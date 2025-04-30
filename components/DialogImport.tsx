import { type KvKeyJSON } from "@deno/kv-utils/json";
import { type ComponentChildren } from "preact";
import { type Signal, useComputed, useSignal } from "@preact/signals";
import { keyJsonToPath } from "$utils/kv.ts";
import { addNotification } from "$utils/state.ts";

import { ErrorAlert } from "./Alert.tsx";
import { CloseButton } from "./CloseButton.tsx";
import { Dialog } from "./Dialog.tsx";
import { useRef } from "preact/hooks";
import { assert } from "@std/assert/assert";

export function DialogImport(
  { open, databaseId, prefix, name, href }: {
    open: Signal<boolean>;
    databaseId?: string;
    prefix: Signal<KvKeyJSON>;
    name?: string;
    href?: string;
  },
) {
  const target = useComputed(() =>
    `/api/kv/${databaseId}/_bulk/${keyJsonToPath(prefix.value)}`
  );
  const form = useRef<HTMLFormElement>(null);
  const alert = useSignal<ComponentChildren>(undefined);
  const uploading = useSignal(false);

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
          Import Entries
        </h3>
        <CloseButton
          onClick={() => {
            form.current?.reset();
            open.value = false;
          }}
        />
      </div>
      <ErrorAlert>{alert}</ErrorAlert>
      <form
        method="dialog"
        ref={form}
        onSubmit={(evt) => {
          uploading.value = false;
          const { currentTarget } = evt;
          const data = new FormData(currentTarget);
          const file = data.get("data");
          const format = data.get("format");
          const overwrite = data.has("overwrite");
          if (format && file && file instanceof File) {
            assert(typeof format === "string");
            const headers: Record<string, string> = { "content-type": format };
            if (name) {
              headers["kview-name"] = name;
            }
            if (href) {
              headers["kview-href"] = href;
            }
            if (overwrite) {
              headers["kview-overwrite"] = "true";
            }
            fetch(new URL(target.value, import.meta.url), {
              method: "POST",
              body: file,
              headers,
            }).then((res) => {
              uploading.value = false;
              if (res.ok) {
                res.json().then(({ id }: { id: number }) => {
                  addNotification(`Job #${id} created.`, "success", true);
                  currentTarget.reset();
                  open.value = false;
                });
              } else {
                alert.value = "Error creating import job.";
                return res.json().then((err) => console.error(err));
              }
            }).catch((err) => {
              uploading.value = false;
              alert.value = "Error creating import job.";
              console.error(err);
            });
          }
          evt.preventDefault();
        }}
      >
        <label
          for="data"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          File
        </label>
        <input
          type="file"
          name="data"
          id="data"
          accept=".ndjson,.jsonl,application/x-ndjson,application/jsonl,application/json-lines"
          class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        />
        <label
          for="format"
          class="mt-4 block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          File format
        </label>
        <select
          name="format"
          id="format"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="application/x-ndjson">
            New Line Delimitated JSON (.ndjson)
          </option>
        </select>
        <div class="flex my-4">
          <div class="flex items-center h-5">
            <input
              id="overwrite"
              name="overwrite"
              aria-describedby="overwrite-text"
              type="checkbox"
              value="true"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div class="ml-2 text-sm">
            <label
              for="overwrite"
              class="font-medium text-gray-900 dark:text-gray-300"
            >
              Overwrite if exists
            </label>
            <p
              id="overwrite-text"
              class="text-xs font-normal text-gray-500 dark:text-gray-300 max-w-xs"
            >
              By default, any imported entries which have a key that matches a
              key of an existing entry will be skipped. By selecting to
              overwrite, the import process will not check if keys exist.
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <button
            class="flex items-center justify-center font-bold text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
            type="submit"
            disabled={uploading}
          >
            Import entries...
          </button>
        </div>
      </form>
    </Dialog>
  );
}
