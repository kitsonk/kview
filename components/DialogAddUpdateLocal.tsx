import { type ComponentChildren } from "preact";
import { useRef } from "preact/hooks";
import { type Signal, useSignal } from "@preact/signals";
import { assert } from "@std/assert/assert";
import { encodeBase64Url } from "@std/encoding/base64url";
import { type KvLocalInfo } from "$utils/kv.ts";

import { AddButton } from "./AddButton.tsx";
import { ErrorAlert } from "./Alert.tsx";
import { CloseButton } from "./CloseButton.tsx";
import { Dialog } from "./Dialog.tsx";
import { Label } from "./Label.tsx";

function formToLocalStoreInfo(
  form: HTMLFormElement,
  store?: KvLocalInfo,
): { id?: string; path?: string; name?: string; previousPath?: string } {
  const data = new FormData(form);
  const path = data.get("path") ?? undefined;
  const name = data.get("name") ?? undefined;
  assert(
    (!path || typeof path === "string") &&
      (!name || typeof name === "string"),
  );
  return { path, name, id: path ?? store?.id, previousPath: store?.path };
}

export function DialogAddUpdateLocal(
  { open, store }: { open: Signal<boolean>; store?: KvLocalInfo },
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
          {store ? "Update local store" : "Add local store"}
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
          alert.value = undefined;
          const { currentTarget } = evt;
          const storeInfo = formToLocalStoreInfo(currentTarget, store);
          const body = JSON.stringify(storeInfo);
          fetch(new URL("/api/local", import.meta.url), {
            body,
            method: "PUT",
            headers: { "content-type": "application/json" },
          }).then((res) => {
            if (!res.ok) {
              alert.value = "Error adding local store.";
              return res.json().then((err) => console.error(err));
            } else {
              if (storeInfo.path && (!store || storeInfo.path !== store.path)) {
                globalThis.location.replace(
                  new URL(
                    `/local/${encodeBase64Url(storeInfo.path)}`,
                    import.meta.url,
                  ),
                );
              } else {
                globalThis.location.reload();
              }
            }
          });
          evt.preventDefault();
        }}
      >
        <div class="grid gap-4 mb-4 sm:grid-cols-2">
          {(!store || (store.id === store.path)) && (
            <div class="sm:col-span-2">
              <Label for="path">Path</Label>
              <input
                type="text"
                name="path"
                id="path"
                value={store?.path}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 md:w-96"
                placeholder="Path (on server) to local store"
                required
              >
              </input>
            </div>
          )}
          <div class="sm:col-span-2">
            <Label for="name">Name</Label>
            <input
              type="text"
              name="name"
              id="name"
              autoComplete="off"
              value={store?.name}
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 md:w-96"
              placeholder="Friendly name (optional)"
            >
            </input>
          </div>
        </div>
        <div class="w-full my-2 md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center md:space-x-3 flex-shrink-0">
          <AddButton>
            {store ? "Update local store" : "Add local store"}
          </AddButton>
        </div>
      </form>
    </Dialog>
  );
}
