import { type Signal } from "@preact/signals";
import type { KvKeyJSON } from "kv-toolbox/json";

import { KvKeyPart } from "./KvKeyPart.tsx";
import IconExpand from "./icons/Expand.tsx";
import IconRightArrow from "./icons/RightArrow.tsx";

interface KvKeyItemProps {
  item: { key: KvKeyJSON; count: number };
  currentEntryKey: Signal<KvKeyJSON | null>;
  currentKey: Signal<KvKeyJSON>;
}

function KvKeyItem(
  { item: { key, count }, currentEntryKey, currentKey }: KvKeyItemProps,
) {
  function onClick(evt: Event) {
    evt.preventDefault();
    if (count) {
      currentEntryKey.value = [...key];
      currentKey.value = [...key];
    } else {
      currentEntryKey.value = [...key];
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
        <div class="flex-none mx-2 text-gray(500 dark:400) group-hover:text(gray-900 dark:white)">
          {count ? <IconExpand size={4} /> : <IconRightArrow size={4} />}
        </div>
      </a>
    </li>
  );
}

interface KvKeyListProps {
  list: Signal<{ key: KvKeyJSON; count: number }[]>;
  currentEntryKey: Signal<KvKeyJSON | null>;
  currentKey: Signal<KvKeyJSON>;
}

export function KvKeyList(
  { list, currentEntryKey, currentKey }: KvKeyListProps,
) {
  if (!list.value.length) {
    return <div class="h(48 md:64 lg:72 xl:96)"></div>;
  }
  return (
    <ul class="divide-y bg-gray-100 dark:bg-gray-800 rounded divide-gray-200 dark:divide-gray-700 h(48 md:64 lg:72 xl:96) overflow-y-auto">
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
