import { type ComponentChildren } from "preact";
import { type Signal, useSignal } from "@preact/signals";
import { useRef } from "preact/hooks";
import { assert } from "$std/assert/assert.ts";
import { formDataToKvValueJSON } from "$utils/formData.ts";
import { keyJsonToPath } from "$utils/kv.ts";
import type { KvEntryJSON, KvKeyJSON } from "$utils/kv_json.ts";
import { addNotification } from "$utils/state.ts";

import { ErrorAlert } from "./Alert.tsx";
import { CloseButton } from "./CloseButton.tsx";
import { Dialog } from "./Dialog.tsx";
import { KvKey } from "./KvKey.tsx";
import { KvValueEditor } from "./KvValueEditor.tsx";

export function DialogEditValue(
  { open, entry, databaseId, loadValue }: {
    open: Signal<boolean>;
    entry: Signal<
      | { key: KvKeyJSON; versionstamp?: undefined; value?: undefined }
      | KvEntryJSON
      | null
    >;
    databaseId?: string;
    loadValue(): void;
  },
) {
  if (!entry.value) {
    return null;
  }
  const form = useRef<HTMLFormElement>(null);
  const alert = useSignal<ComponentChildren>(undefined);

  return (
    <Dialog
      class="p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5"
      open={open}
    >
      <div class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {entry.value.value ? "Edit value" : "Add value"}
        </h3>
        <CloseButton
          onClick={() => {
            alert.value = undefined;
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
          alert.value === undefined;
          const { currentTarget } = evt;
          const data = new FormData(currentTarget);
          const valueType = data.get("value_type");
          const value = data.get("value");
          const expiresIn = data.get("expires_in");
          const overwrite = data.get("overwrite");
          assert(
            typeof valueType === "string" && typeof value === "string" &&
              typeof expiresIn === "string" && entry.value,
          );
          const target = `/api/kv/${databaseId}/${
            keyJsonToPath(entry.value.key)
          }`;
          const body = JSON.stringify({
            value: formDataToKvValueJSON(valueType, value),
            expiresIn: expiresIn ? parseInt(expiresIn, 10) : undefined,
            overwrite: overwrite === "true",
            versionstamp: entry.value.versionstamp,
          });
          fetch(new URL(target, import.meta.url), {
            body,
            method: "PUT",
            headers: { "content-type": "application/json" },
          }).then((res) => {
            if (!res.ok) {
              if (res.status === 409) {
                alert.value =
                  'Value in the store has changed. To ignore an update anyway, select "overwrite" option.';
              } else {
                alert.value = "Error setting value.";
                return res.json().then((err) => console.error(err));
              }
            } else {
              addNotification(
                entry.value?.value
                  ? "Value successfully updated."
                  : "Value secuccessfully set.",
                "success",
                true,
              );
              currentTarget.reset();
              loadValue();
              open.value = false;
            }
          }).catch((err) => {
            alert.value = "Error setting value.";
            console.error(err);
          });
          evt.preventDefault();
        }}
      >
        <div class="grid gap-4 mb-4 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <h2 class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Key
            </h2>
            <KvKey value={entry.value.key} noLink />
          </div>
          <KvValueEditor value={entry.value.value} />
          <div>
            <label
              for="expires_in"
              class="block mb-2 test-sm font-medium text-gray-900 dark:text-white"
            >
              Expires In
            </label>
            <input
              type="number"
              id="expires_in"
              name="expires_in"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="in milliseconds (optional)"
            />
          </div>
          {entry.value.value &&
            (
              <fieldset>
                <legend class="block mb-2 test-sm font-medium text-gray-900 dark:text-white">
                  Consistency
                </legend>
                <div class="flex">
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
                      Overwrite if different
                    </label>
                    <p
                      id="overwrite-text"
                      class="text-xs font-normal text-gray-500 dark:text-gray-300 max-w-xs"
                    >
                      By default, the version of the value will be checked
                      against what is currently stored, and the update will fail
                      if it is different. Checking this value will skip this
                      validation.
                    </p>
                  </div>
                </div>
              </fieldset>
            )}
        </div>
        <button
          class="flex items-center justify-center font-bold text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
          type="submit"
        >
          {entry.value.value ? "Update value" : "Add value"}
        </button>
      </form>
    </Dialog>
  );
}
