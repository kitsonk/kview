import type { SignalLike } from "preact";
import type { KvKeyListElement } from "@/utils/blobs.ts";

import { KvKeyPart } from "./KvKeyPart.tsx";

function KvKeyListItem({ part, onSelect }: { part: KvKeyListElement; onSelect?: (part: KvKeyListElement) => void }) {
  const keyPart = part.key[part.key.length - 1];
  if (part.count) {
    return (
      <div
        class="px-5 py-2.5 hover:bg-base-200 cursor-pointer"
        onClick={(evt) => {
          evt.preventDefault();
          onSelect?.(part);
        }}
      >
        <div class="flex">
          <div class="grow">
            <KvKeyPart keyPart={keyPart} />
          </div>
          <div>
            <span class="iconify lucide--chevron-right size-5"></span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      class="px-5 py-2.5 hover:bg-base-200 cursor-pointer border-base-300 border-b"
      onClick={(evt) => {
        evt.preventDefault();
        onSelect?.(part);
      }}
    >
      <KvKeyPart keyPart={keyPart} />
    </div>
  );
}

export function SelectKeyParts(
  { parts, loading, onSelect }: {
    parts: SignalLike<KvKeyListElement[]>;
    loading: SignalLike<boolean>;
    onSelect?: (part: KvKeyListElement) => void;
  },
) {
  return (
    <div class="bg-base-100 border-base-300 divide-base-300 rounded-field divide-y border overflow-y-auto h-96">
      {loading.value
        ? (
          <div class="flex justify-center items-center h-full">
            <span class="loading loading-ring loading-xl"></span>
          </div>
        )
        : parts.value.map((part, i) => <KvKeyListItem key={i} part={part} onSelect={onSelect} />)}
    </div>
  );
}
