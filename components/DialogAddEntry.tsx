import { type KvKeyJSON } from "@kitsonk/kv-toolbox/json";
import { type ComponentChildren } from "preact";
import { type Signal, useSignal } from "@preact/signals";
import { useRef } from "preact/hooks";
import { assert } from "@std/assert/assert";
import {
  formDataToKvKeyPartJSON,
  formDataToKvValueJSON,
} from "$utils/formData.ts";
import { keyJsonToPath } from "$utils/kv.ts";
import { addNotification } from "$utils/state.ts";

import { AddButton } from "./AddButton.tsx";
import { ErrorAlert } from "./Alert.tsx";
import { CloseButton } from "./CloseButton.tsx";
import { Dialog } from "./Dialog.tsx";
import { Label } from "./Label.tsx";
import { KvKey } from "./KvKey.tsx";
import { KvValueEditor } from "./KvValueEditor.tsx";

export function DialogAddEntry(
  { open, currentKey, databaseId, loadKeys, subEntry }: {
    open: Signal<boolean>;
    currentKey: Signal<KvKeyJSON>;
    databaseId?: string;
    loadKeys: () => void;
    subEntry?: boolean;
  },
) {
  const form = useRef<HTMLFormElement>(null);
  const alert = useSignal<ComponentChildren>(undefined);
  return (
    <Dialog
      class="p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5"
      open={open}
    >
      <div class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {subEntry ? "Add sub-entry" : "Add entry"}
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
          const keyPartType = data.get("key_part_type");
          const keyPart = data.get("key_part");
          const valueType = data.get("value_type");
          const value = data.get("value");
          const expiresIn = data.get("expires_in");
          const overwrite = data.get("overwrite");
          assert(
            typeof keyPartType === "string" && typeof keyPart === "string" &&
              typeof valueType === "string" && typeof value === "string" &&
              typeof expiresIn === "string",
          );
          const key: KvKeyJSON = [
            ...currentKey.value,
            formDataToKvKeyPartJSON(keyPartType, keyPart),
          ];
          const target = `/api/kv/${databaseId}/${keyJsonToPath(key)}`;
          const body = JSON.stringify(
            {
              value: formDataToKvValueJSON(valueType, value),
              expiresIn: expiresIn ? parseInt(expiresIn, 10) : undefined,
              overwrite: overwrite === "true",
            },
          );
          fetch(new URL(target, import.meta.url), {
            body,
            method: "PUT",
            headers: { "content-type": "application/json" },
          }).then((res) => {
            if (!res.ok) {
              if (res.status === 409) {
                alert.value = "Key already exists, overwrite not specified.";
              } else {
                alert.value = "Error adding entry.";
                return res.json().then((err) => console.error(err));
              }
            } else {
              addNotification("Entry added successfully.", "success", true);
              currentTarget.reset();
              loadKeys();
              open.value = false;
            }
          }).catch((err) => {
            alert.value = "Error adding entry.";
            console.error(err);
          });
          evt.preventDefault();
        }}
      >
        <div class="grid gap-4 mb-4 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <h2 class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Parent Key
            </h2>
            <KvKey value={currentKey} showRoot noLink />
          </div>
          <div>
            <Label for="key_part">Key Part</Label>
            <input
              type="text"
              name="key_part"
              id="key_part"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Key part name"
              required
            />
          </div>
          <div>
            <Label for="key_part_type">Key Part Type</Label>
            <select
              id="key_part_type"
              name="key_part_type"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            >
              <option selected value="string">String</option>
              <option value="number">Number</option>
              <option value="bigint">BigInt</option>
              <option value="boolean">Boolean</option>
              <option value="Uint8Array">Uint8Array</option>
            </select>
          </div>
          <KvValueEditor />
          <div>
            <Label for="expires_in">Expires In</Label>
            <input
              type="number"
              id="expires_in"
              name="expires_in"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="in milliseconds (optional)"
            />
          </div>
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
                <Label for="overwrite">Overwrite if exists</Label>
                <p
                  id="overwrite-text"
                  class="text-xs font-normal text-gray-500 dark:text-gray-300 max-w-xs"
                >
                  If the key already exists, replace the value with the supplied
                  value. Otherwise, if the key already exists, attempting to add
                  the entry will fail.
                </p>
              </div>
            </div>
          </fieldset>
        </div>
        <AddButton>
          {subEntry ? "Add new sub-entry" : "Add new entry"}
        </AddButton>
      </form>
    </Dialog>
  );
}
