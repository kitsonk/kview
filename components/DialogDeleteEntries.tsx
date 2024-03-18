import { type KvKeyJSON } from "@kitsonk/kv-toolbox/json";
import { type ComponentChildren } from "preact";
import { useRef } from "preact/hooks";
import {
  type Signal,
  useComputed,
  useSignal,
  useSignalEffect,
} from "@preact/signals";
import { keyJsonToPath } from "$utils/kv.ts";
import { addNotification } from "$utils/state.ts";
import {
  kvTreeToNodes,
  resetSelected,
  state,
  TreeState,
} from "$utils/tree_state.ts";

import { ErrorAlert } from "./Alert.tsx";
import { CloseButton } from "./CloseButton.tsx";
import { Dialog } from "./Dialog.tsx";
import { Loader } from "./Loader.tsx";
import { TreeView } from "./TreeView.tsx";

export function DialogDeleteEntries(
  { open, databaseId, prefix, loadKeys }: {
    open: Signal<boolean>;
    databaseId?: string;
    prefix?: Signal<KvKeyJSON | null>;
    loadKeys(): void;
  },
) {
  if (!databaseId) {
    return null;
  }
  const form = useRef<HTMLFormElement>(null);
  const alert = useSignal<ComponentChildren>(undefined);
  const loading = useSignal(false);
  const deleting = useSignal(false);
  const disabled = useComputed(() =>
    !state.selectedCount.value || deleting.value
  );

  function loadTree() {
    loading.value = true;
    const target = `/api/kv/${databaseId}/${
      keyJsonToPath(prefix?.value ?? [])
    }?tree`;
    fetch(new URL(target, import.meta.url))
      .then((res) => {
        if (res.ok) {
          return res.json().then((data) => {
            state.tree.value = kvTreeToNodes(data);
          });
        }
        console.error(
          `Unable to fetch tree: ${res.status} ${res.statusText}`,
        );
        return res.text().then((data) =>
          console.error(`Response body:\n\n${data}`)
        );
      })
      .finally(() => {
        loading.value = false;
      });
  }

  useSignalEffect(loadTree);

  return (
    <Dialog
      class="p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5 md:w-1/2 xl:w-1/3"
      open={open}
    >
      <div class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Delete Entries
        </h3>
        <CloseButton
          onClick={() => {
            alert.value = undefined;
            open.value = false;
            resetSelected(state.tree);
          }}
        />
      </div>
      <ErrorAlert>{alert}</ErrorAlert>
      <form
        method="dialog"
        ref={form}
        onSubmit={(evt) => {
          alert.value = undefined;
          deleting.value = true;
          const target = `/api/kv/${databaseId}/${
            prefix?.value ? keyJsonToPath(prefix.value) : ""
          }`;
          const body = JSON.stringify(state.selected.value);
          fetch(new URL(target, import.meta.url), {
            body,
            method: "DELETE",
            headers: { "content-type": "application/json" },
          }).then((res) => {
            if (!res.ok) {
              alert.value = "Error deleting entries.";
              return res.json().then((err) => console.error(err));
            } else {
              addNotification("Successfully deleted entries.", "success", true);
              open.value = false;
              loadTree();
              loadKeys();
            }
          }).catch((err) => {
            alert.value = "Error deleting entries.";
            console.log(err);
          })
            .finally(() => {
              deleting.value = false;
            });
          evt.preventDefault();
        }}
      >
        <p class="mb-4 font-light text-gray-500 dark:text-gray-400">
          Select keys of entries to be deleted. Selecting a parent key part will
          also select the children. The arrows can be used to expand or collapse
          children.
        </p>
        <div class="h(48 md:64 lg:72 xl:96) rounded p-2 bg-gray-50 dark:bg-gray-900 overflow-auto mb-6">
          <TreeState.Provider value={state}>
            {loading.value
              ? (
                <div class="bg-gray(100 dark:800) flex items-center justify-center">
                  <Loader />
                </div>
              )
              : <TreeView />}
          </TreeState.Provider>
        </div>
        <button
          class="flex items-center justify-center font-bold text-white bg-red-700 disabled:bg-gray-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:disabled:bg-gray-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
          type="submit"
          disabled={disabled}
        >
          Delete {state.selectedCount}{" "}
          {state.selectedCount.value === 1 ? "entry" : "entires"}
        </button>
      </form>
    </Dialog>
  );
}
