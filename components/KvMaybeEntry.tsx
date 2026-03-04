import type { KvEntryMaybeJSON } from "@deno/kv-utils/json";
import { isEntryJSON } from "@/utils/kv_json.ts";

import { KvKey } from "./KvKey.tsx";
import { KvValue } from "./KvValue.tsx";
import { KvValueType } from "./KvValueType.tsx";

export function KvMaybeEntry({ maybeEntry }: { maybeEntry: KvEntryMaybeJSON }) {
  if (!isEntryJSON(maybeEntry)) {
    return (
      <div class="card card-border bg-base-200">
        <div class="card-body gap-0">
          <div class="card-title">Entry</div>
          <div class="fieldset mt-2 gap-4">
            <div class="space-y-2">
              <div class="fieldset-label mt-2">
                Key
              </div>
              <KvKey
                kvKey={maybeEntry.key}
              />
            </div>
            <div class="mx-auto py-4 italic text-lg opacity-60">No value.</div>
          </div>
          <div class="mt-5 flex items-center justify-end gap-3 flex-wrap">
            <button type="button" class="btn btn-sm btn-neutral">Add value...</button>
            <button type="button" class="btn btn-sm btn-neutral">Add sub-entry...</button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div class="card card-border bg-base-200">
      <div class="card-body gap-0">
        <div class="card-title">Entry</div>
        <div class="fieldset mt-2 gap-4">
          <div class="space-y-2">
            <div class="fieldset-label mt-2">
              Key
            </div>
            <KvKey
              kvKey={maybeEntry.key}
            />
          </div>
          <div class="space-y-2">
            <div class="fieldset-label">
              Type
            </div>
            <KvValueType type={maybeEntry.value.type} />
          </div>
          <div class="space-y-2 min-w-0">
            <div class="fieldset-label">Value</div>
            <KvValue value={maybeEntry.value} />
          </div>
          <div class="opacity-60 italic">Version: {maybeEntry.versionstamp}</div>
        </div>
        <div class="mt-5 flex items-center justify-end gap-3 flex-wrap">
          <button type="button" class="btn btn-sm btn-neutral">Update value...</button>
          <button type="button" class="btn btn-sm btn-neutral">Add sub-entry...</button>
          <button type="button" class="btn btn-sm btn-error">Delete entry</button>
        </div>
      </div>
    </div>
  );
}
