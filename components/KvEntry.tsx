import { type Signal } from "@preact/signals";
import { type KvEntryJSON, type KvKeyJSON } from "$utils/kv.ts";

import { KvKey } from "./KvKey.tsx";
import { KvValue } from "./KvValue.tsx";

export function KvEntry(
  { entry }: {
    entry: Signal<
      | { key: KvKeyJSON; versionstamp?: undefined; value?: undefined }
      | KvEntryJSON
      | null
    >;
  },
) {
  if (!entry.value) {
    return null;
  }
  const { key, versionstamp, value } = entry.value;
  return (
    <div class="border rounded p-2 lg:col-span-2">
      <h2 class="font-bold mb-2">Key</h2>
      <KvKey value={key} />
      {value
        ? (
          <>
            <KvValue value={value} />
            <div class="text-sm text-gray(600 dark:400) p-1 italic">
              Version: {versionstamp}
            </div>
          </>
        )
        : (
          <div class="w-auto p-8 flex justify-center">
            <div class="italic text-gray(600 dark:400)">
              no value
            </div>
          </div>
        )}
    </div>
  );
}
