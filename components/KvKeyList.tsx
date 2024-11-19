import { type KvKeyJSON } from "@deno/kv-utils/json";
import { type Signal } from "@preact/signals";

import { KvKeyPart } from "./KvKeyPart.tsx";
import IconExpand from "./icons/Expand.tsx";
import IconRightArrow from "./icons/RightArrow.tsx";

interface KvKeyItemProps {
  item: { key: KvKeyJSON; count: number; isBlob?: boolean };
  currentEntryKey: Signal<{ key: KvKeyJSON; isBlob?: boolean } | null>;
  currentKey: Signal<KvKeyJSON>;
}

function KvKeyItem(
  { item: { key, count, isBlob }, currentEntryKey, currentKey }: KvKeyItemProps,
) {
  function onClick(evt: Event) {
    evt.preventDefault();
    if (count) {
      currentEntryKey.value = { key, isBlob };
      currentKey.value = [...key];
    } else {
      currentEntryKey.value = { key, isBlob };
    }
  }
  return (
    <li class="py-2 dark:hover:bg-gray-700 hover:bg-gray-200 group">
      <a
        href="#"
        onClick={onClick}
        class="flex items-center"
      >
        <div class="flex-grow">
          <KvKeyPart part={key[key.length - 1]} />
        </div>
        <div class="flex-none mx-2 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 group-hover:dark:text-white">
          {count ? <IconExpand size={4} /> : <IconRightArrow size={4} />}
        </div>
      </a>
    </li>
  );
}

interface KvKeyListProps {
  list: Signal<{ key: KvKeyJSON; count: number; isBlob?: boolean }[]>;
  currentEntryKey: Signal<{ key: KvKeyJSON; isBlob?: boolean } | null>;
  currentKey: Signal<KvKeyJSON>;
}

export function KvKeyList(
  { list, currentEntryKey, currentKey }: KvKeyListProps,
) {
  if (!list.value.length) {
    return <div class="h-48 md:h-64 lg:h-72 xl:h-96"></div>;
  }
  return (
    <ul class="divide-y bg-gray-100 dark:bg-gray-800 rounded divide-gray-200 dark:divide-gray-700 h-48 md:h-64 lg:h-72 xl:h-96 overflow-y-auto">
      {list.value.map((item) => (
        <KvKeyItem
          currentEntryKey={currentEntryKey}
          currentKey={currentKey}
          item={item}
        />
      ))}
    </ul>
  );
}
