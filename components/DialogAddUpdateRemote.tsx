import { type ComponentChildren } from "preact";
import { type Signal, useSignal } from "@preact/signals";
import { useRef } from "preact/hooks";
import { assert } from "$std/assert/assert.ts";
import { encodeBase64Url } from "$std/encoding/base64url.ts";
import { type RemoteStoreInfo } from "$utils/remoteStores.ts";
import { addNotification } from "$utils/state.ts";

import { AddButton } from "./AddButton.tsx";
import { ErrorAlert, SuccessAlert } from "./Alert.tsx";
import { CloseButton } from "./CloseButton.tsx";
import { Dialog } from "./Dialog.tsx";
import { Label } from "./Label.tsx";

function formToRemoteStoreInfo(form: HTMLFormElement): RemoteStoreInfo {
  const data = new FormData(form);
  const url = data.get("url");
  const name = data.get("name") ?? undefined;
  const accessToken = data.get("access_token");
  assert(typeof url === "string" && typeof accessToken === "string");
  if (name) {
    assert(typeof name === "string");
  }
  return { url, name, accessToken };
}

export function DialogAddUpdateRemote(
  { open, loadStores, store }: {
    open: Signal<boolean>;
    loadStores?(): void;
    store?: RemoteStoreInfo;
  },
) {
  const form = useRef<HTMLFormElement>(null);
  const alert = useSignal<ComponentChildren>(undefined);
  const success = useSignal<ComponentChildren>(undefined);
  const checking = useSignal(false);
  return (
    <Dialog
      class="p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5"
      open={open}
    >
      <div class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {store ? "Update remote store" : "Add remote store"}
        </h3>
        <CloseButton
          onClick={() => {
            alert.value = undefined;
            success.value = undefined;
            form.current?.reset();
            open.value = false;
          }}
        />
      </div>
      <ErrorAlert>{alert}</ErrorAlert>
      <SuccessAlert>{success}</SuccessAlert>
      <form
        method="dialog"
        ref={form}
        onSubmit={(evt) => {
          alert.value = undefined;
          success.value = undefined;
          const { currentTarget } = evt;
          const storeInfo = formToRemoteStoreInfo(currentTarget);
          const body = JSON.stringify(
            store ? { ...storeInfo, oldUrl: store.url } : storeInfo,
          );
          fetch(new URL("/api/remote", import.meta.url), {
            body,
            method: "PUT",
            headers: { "content-type": "application/json" },
          }).then((res) => {
            if (!res.ok) {
              alert.value = store
                ? "Error updating remote store."
                : "Error adding remote store.";
              return res.json().then((err) => console.error(err));
            } else {
              if (store) {
                if (store.url === storeInfo.url) {
                  window.location.reload();
                } else {
                  window.location.replace(
                    new URL(
                      `/remote/${encodeBase64Url(storeInfo.url)}`,
                      import.meta.url,
                    ),
                  );
                }
              } else {
                addNotification(
                  "Remote store added successfully.",
                  "success",
                  true,
                );
                currentTarget.reset();
                loadStores?.();
                open.value = false;
              }
            }
          });
          evt.preventDefault();
        }}
      >
        <div class="grid gap-4 mb-4 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <Label for="url">URL</Label>
            <input
              type="url"
              name="url"
              id="url"
              value={store?.url}
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Location of remote store"
              required
            >
            </input>
          </div>
          <div>
            <Label for="name">Name</Label>
            <input
              type="text"
              name="name"
              id="name"
              value={store?.name}
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Label for URL (optional)"
            >
            </input>
          </div>
          <div>
            <Label for="access_token">Access Token</Label>
            <input
              type="text"
              name="access_token"
              id="access_token"
              value={store?.accessToken}
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Token to access remote store"
              required
            >
            </input>
          </div>
        </div>
        <div class="w-full my-2 md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center md:space-x-3 flex-shrink-0">
          <AddButton>
            {store ? "Update remote store" : "Add remote store"}
          </AddButton>
          <button
            class={checking.value
              ? "py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center"
              : "flex items-center justify-center font-bold text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"}
            type="button"
            disabled={checking.value}
            onClick={({ currentTarget }) => {
              alert.value = undefined;
              success.value = undefined;
              checking.value = true;
              currentTarget.disabled = true;
              const body = form.current &&
                JSON.stringify(formToRemoteStoreInfo(form.current));
              fetch(new URL("/api/remote/check", import.meta.url), {
                body,
                method: "POST",
                headers: { "content-type": "application/json" },
              }).then((res) => {
                if (res.ok) {
                  return res.json().then(
                    (
                      { result, reason }: {
                        result: "success" | "failure";
                        reason?: string;
                      },
                    ) => {
                      if (result === "success") {
                        success.value = "Able to connect to remote store.";
                      } else if (reason && reason.includes("DeadlineError")) {
                        alert.value =
                          "Unable to connect: Timeout. Check connection information.";
                      } else if (
                        reason && reason.includes("Invalid access token")
                      ) {
                        alert.value =
                          "Unable to connect: Invalid access token.";
                      } else {
                        alert.value = "Unable to connect to remote store.";
                        console.error(reason);
                      }
                    },
                  );
                } else {
                  alert.value = "Something went wrong!";
                }
              }).catch(() => {
                alert.value = "Something went wrong!";
              }).finally(() => checking.value = false);
            }}
          >
            {checking.value
              ? (
                <>
                  <svg
                    aria-hidden="true"
                    role="status"
                    class="inline pr-4 w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="#1C64F2"
                    />
                  </svg>{" "}
                  Validating...
                </>
              )
              : "Validate connection"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
