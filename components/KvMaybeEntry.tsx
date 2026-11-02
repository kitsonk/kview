import type { KvValueJSON } from "@deno/kv-utils/json";
import type { BlobMeta } from "@kitsonk/kv-toolbox/blob";
import { useComputed, useSignal } from "@preact/signals";
import type { SignalLike } from "preact";
import { type BlobEntryMaybeJSON, isBlobEntryJSON, isEntryJSON } from "@/utils/blobs.ts";
import { keyJsonToPath } from "@/utils/kv_path.ts";
import { notify } from "@/utils/notifications.ts";

import { DialogAddEditValue } from "./DialogAddEditValue.tsx";
import { KvKey } from "./KvKey.tsx";
import { KvValue } from "./KvValue.tsx";
import { KvValueType } from "./KvValueType.tsx";

const UNSUPPORTED_VALUE_TYPES = new Set<string>([
  "buffer",
  "Blob",
  "File",
]);

export function KvMaybeEntry(
  { maybeEntry, loading, storeId, onChange }: {
    maybeEntry: SignalLike<BlobEntryMaybeJSON | null>;
    loading: SignalLike<boolean>;
    storeId?: string;
    onChange?: () => void;
  },
) {
  const editDialogOpen = useSignal(false);
  const submitError = useSignal<string | null>(null);
  const submitting = useSignal(false);
  const dialogValue = useComputed<KvValueJSON | BlobMeta | undefined>(() => {
    const entry = maybeEntry.value;
    if (!entry) return undefined;
    if (isBlobEntryJSON(entry)) return entry.meta;
    if (isEntryJSON(entry)) return entry.value;
    return undefined;
  });

  async function handleSubmit(
    type: string,
    value: KvValueJSON | undefined,
  ): Promise<void> {
    const entry = maybeEntry.value;
    if (!storeId || !entry) {
      submitError.value = "Missing store or entry context";
      notify("error", "Cannot save: missing store or entry context.");
      return;
    }
    if (UNSUPPORTED_VALUE_TYPES.has(type)) {
      submitError.value = "Blob/buffer values are not yet supported";
      notify("error", "Blob/buffer values are not yet supported.");
      return;
    }
    if (!value) {
      submitError.value = "No value to save";
      notify("error", "No value to save.");
      return;
    }
    if (!entry.key) {
      submitError.value = "Entry has no key";
      notify("error", "Cannot save: entry has no key.");
      return;
    }
    submitting.value = true;
    submitError.value = null;
    try {
      const keyPath = keyJsonToPath(entry.key);
      const path = `/api/store/${storeId}/entry/${keyPath}`;
      const res = await fetch(path, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(value),
      });
      if (!res.ok) {
        let detail = `${res.status} ${res.statusText}`;
        try {
          const errBody = await res.json() as { error?: string };
          if (errBody?.error) {
            detail = errBody.error;
          }
        } catch {
          // ignore JSON parse error; fall back to status text
        }
        submitError.value = detail;
        notify("error", `Failed to save value: ${detail}`);
        return;
      }
      notify("success", "Value saved.");
      editDialogOpen.value = false;
      onChange?.();
    } catch (err) {
      const message = (err as Error).message;
      submitError.value = message;
      notify("error", `Network error: ${message}`);
    } finally {
      submitting.value = false;
    }
  }

  if (loading.value) {
    return (
      <div class="card card-border bg-base-200">
        <div class="card-body gap-0">
          <div class="card-title">Entry</div>
          <div class="flex justify-center items-center h-48">
            <span class="loading loading-ring loading-xl"></span>
          </div>
        </div>
      </div>
    );
  }
  if (!maybeEntry.value) {
    return undefined;
  }
  const card = !isEntryJSON(maybeEntry.value)
    ? (
      <div class="card card-border bg-base-200">
        <div class="card-body gap-0">
          <div class="card-title">Entry</div>
          <div class="fieldset mt-2 gap-4">
            <div class="space-y-2">
              <div class="fieldset-label mt-2">
                Key
              </div>
              <KvKey
                kvKey={maybeEntry.value.key}
              />
            </div>
            <div class="mx-auto py-4 italic text-lg opacity-60">No value.</div>
          </div>
          <div class="mt-5 flex items-center justify-end gap-3 flex-wrap">
            <button type="button" class="btn btn-sm btn-neutral" onClick={() => (editDialogOpen.value = true)}>
              Add value...
            </button>
            <button type="button" class="btn btn-sm btn-neutral">Add sub-entry...</button>
          </div>
        </div>
      </div>
    )
    : (
      <div class="card card-border bg-base-200">
        <div class="card-body gap-0">
          <div class="card-title">Entry</div>
          <div class="fieldset mt-2 gap-4">
            <div class="space-y-2">
              <div class="fieldset-label mt-2">
                Key
              </div>
              <KvKey
                kvKey={maybeEntry.value.key}
              />
            </div>
            <div class="space-y-2">
              <div class="fieldset-label">
                Type
              </div>
              <KvValueType entry={maybeEntry.value} />
            </div>
            <div class="space-y-2 min-w-0">
              <div class="fieldset-label">Value</div>
              <KvValue entry={maybeEntry.value} storeId={storeId} noBadge />
            </div>
            <div class="opacity-60 italic">Version: {maybeEntry.value.versionstamp}</div>
          </div>
          <div class="mt-5 flex items-center justify-end gap-3 flex-wrap">
            <button type="button" class="btn btn-sm btn-neutral" onClick={() => (editDialogOpen.value = true)}>
              Update value...
            </button>
            <button type="button" class="btn btn-sm btn-neutral">Add sub-entry...</button>
            <button type="button" class="btn btn-sm btn-error">Delete entry</button>
          </div>
        </div>
      </div>
    );
  return (
    <>
      {card}
      <DialogAddEditValue
        isOpen={editDialogOpen}
        onClose={() => {
          submitError.value = null;
          editDialogOpen.value = false;
        }}
        value={dialogValue}
        error={submitError}
        submitting={submitting}
        onSubmit={(type, value, _file) => {
          void handleSubmit(type, value);
        }}
      />
    </>
  );
}
