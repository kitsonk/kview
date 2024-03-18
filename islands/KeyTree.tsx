import { type Signal, useSignal, useSignalEffect } from "@preact/signals";
import { Loader } from "$components/Loader.tsx";
import { TreeView } from "$components/TreeView.tsx";
import type { KvKeyJSON } from "kv-toolbox/json";
import { keyJsonToPath } from "$utils/kv.ts";
import { kvTreeToNodes, state, TreeState } from "$utils/tree_state.ts";

export default function KeyTree(
  { databaseId, prefix }: {
    databaseId: string;
    prefix?: Signal<KvKeyJSON | null>;
  },
) {
  const loadingTree = useSignal(false);

  useSignalEffect(() => {
    loadingTree.value = true;
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
        loadingTree.value = false;
      });
  });

  return (
    <div class="col-span-3 p-8">
      <TreeState.Provider value={state}>
        {loadingTree.value
          ? (
            <div class="h(48 md:64 lg:72 xl:96) bg-gray(100 dark:800) rounded flex items-center justify-center">
              <Loader />
            </div>
          )
          : <TreeView />}
      </TreeState.Provider>
    </div>
  );
}
