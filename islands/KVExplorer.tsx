import { KvMaybeEntry } from "@/components/KvMaybeEntry.tsx";
import { Path } from "@/components/Path.tsx";
import { SelectKeyParts } from "@/components/SelectKeyParts.tsx";

export default function KVExplorer() {
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
                  <Path
                    path={[
                      { type: "string", value: "language" },
                      { type: "string", value: "assembly" },
                      { type: "number", value: 2008 },
                    ]}
                  />
                </div>
                <div class="space-y-2">
                  <div class="fieldset-label mt-2">
                    Key Parts
                  </div>
                  <SelectKeyParts />
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
            maybeEntry={{
              key: [{ type: "string", value: "language" }, { type: "string", value: "assembly" }, {
                type: "number",
                value: 2008,
              }],
              value: {
                type: "Set",
                value: [
                  { type: "string", value: "C" },
                  { type: "string", value: "C++" },
                  { type: "string", value: "Rust" },
                  { type: "string", value: "TypeScript" },
                ],
              },
              versionstamp: "00000000000000810000",
            }}
          />
        </div>
      </div>
    </div>
  );
}
