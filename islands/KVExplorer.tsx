import { useSignal, useSignalEffect } from "@preact/signals";
import type { KvEntryMaybeJSON, KvKeyJSON } from "@deno/kv-utils/json";
import { KvMaybeEntry } from "@/components/KvMaybeEntry.tsx";
import { Path } from "@/components/Path.tsx";
import { SelectKeyParts } from "@/components/SelectKeyParts.tsx";
import type { BlobEntryMaybeJSON, KvKeyListElement } from "@/utils/blobs.ts";
import { keyJsonToPath } from "@/utils/kv_path.ts";

export default function KVExplorer({ storeId }: { storeId: string }) {
  const currentKey = useSignal<KvKeyJSON>([]);
  const currentEntryKey = useSignal<{ key: KvKeyJSON; isBlob?: boolean } | null>(null);
  const currentMaybeEntry = useSignal<BlobEntryMaybeJSON | null>(null);
  const keyParts = useSignal<KvKeyListElement[]>([]);
  const keysLoading = useSignal(false);
  const maybeEntryLoading = useSignal(false);
  let controller: AbortController | null = null;
  let maybeEntryController: AbortController | null = null;

  function loadKeyParts() {
    keysLoading.value = true;
    const target = currentKey.value.length
      ? `/api/store/${storeId}/count/${keyJsonToPath(currentKey.value)}`
      : `/api/store/${storeId}/count`;
    const url = new URL(target, import.meta.url);
    if (controller) {
      controller.abort();
    }
    controller = new AbortController();
    const { signal } = controller;
    fetch(url, { signal })
      .then((res) => {
        if (!res.ok) {
          console.error(`Failed to load key parts: ${res.status} ${res.statusText}`);
          return;
        }
        return res.json().then((data: KvKeyListElement[]) => keyParts.value = data);
      })
      .finally(() => {
        keysLoading.value = false;
        controller = null;
      });
  }

  useSignalEffect(loadKeyParts);

  function loadMaybeEntry() {
    if (currentEntryKey.value === null) {
      return;
    }
    maybeEntryLoading.value = true;
    const { key, isBlob } = currentEntryKey.value;
    const target = isBlob
      ? `/api/store/${storeId}/meta/${keyJsonToPath(key)}`
      : `/api/store/${storeId}/entry/${keyJsonToPath(key)}`;
    const url = new URL(target, import.meta.url);
    if (maybeEntryController) {
      maybeEntryController.abort();
    }
    maybeEntryController = new AbortController();
    const { signal } = maybeEntryController;
    fetch(url, { signal })
      .then((res) => {
        if (res.ok) {
          return res.json().then((data: BlobEntryMaybeJSON) => currentMaybeEntry.value = data);
        }
        if (res.status === 404) {
          currentMaybeEntry.value = { key, value: null, versionstamp: null } as (KvEntryMaybeJSON & { meta: never });
        }
        console.error(`Failed to load key parts: ${res.status} ${res.statusText}`);
        return;
      })
      .finally(() => {
        maybeEntryLoading.value = false;
        maybeEntryController = null;
      });
  }

  useSignalEffect(loadMaybeEntry);

  return (
    <div class="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-5 2xl:grid-cols-10">
      <div class="xl:col-span-2 2xl:col-span-3">
        <div class="space-y-6">
          <div class="card card-border bg-base-200">
            <div class="card-body gap-0">
              <div class="card-title">Keys</div>
              <div class="fieldset mt-2 gap-4">
                <div class="space-y-2">
                  <div class="fieldset-label mt-2">
                    Current Path
                  </div>
                  <Path path={currentKey.value} onClick={(path) => currentKey.value = path} />
                </div>
                <div class="space-y-2">
                  <div class="fieldset-label mt-2">
                    Key Parts
                  </div>
                  <SelectKeyParts
                    parts={keyParts}
                    loading={keysLoading}
                    onSelect={(part) => {
                      const { count, key, isBlob } = part;
                      if (count >= 1) {
                        currentKey.value = key;
                      }
                      currentEntryKey.value = { key, isBlob };
                    }}
                  />
                </div>
              </div>
              <div class="mt-5 flex items-center justify-end gap-3 flex-wrap">
                <button type="button" class="btn btn-sm btn-neutral">Import...</button>
                <button type="button" class="btn btn-sm btn-neutral">Export...</button>
                <button type="button" class="btn btn-sm btn-error">Delete...</button>
                <button type="button" class="btn btn-sm btn-neutral">Add entry...</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="xl:col-span-3 2xl:col-span-7">
        <div class="space-y-6">
          <KvMaybeEntry
            maybeEntry={currentMaybeEntry}
            loading={maybeEntryLoading}
            storeId={storeId}
            onChange={loadMaybeEntry}
          />
        </div>
      </div>
    </div>
  );
}
