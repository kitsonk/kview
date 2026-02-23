import { KvKeyPart } from "./KvKeyPart.tsx";

export function SelectKeyParts() {
  return (
    <div class="bg-base-100 border-base-300 divide-base-300 rounded-field divide-y border overflow-y-auto h-96">
      <div class="px-5 py-2.5 hover:bg-base-200 cursor-pointer">
        <div class="flex">
          <div class="grow">
            <KvKeyPart keyPart={{ type: "number", value: 3 }} />
          </div>
          <div>
            <span class="iconify lucide--chevron-right size-5"></span>
          </div>
        </div>
      </div>
      <div class="px-5 py-2.5 hover:bg-base-200 cursor-pointer border-base-300 border-b">
        <KvKeyPart keyPart={{ type: "number", value: 5 }} />
      </div>
    </div>
  );
}
