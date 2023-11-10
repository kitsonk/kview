import { type ComponentChildren } from "preact";
import { type Signal } from "@preact/signals";
import { type KvKeyJSON } from "$utils/kv.ts";

import IconHome from "./icons/Home.tsx";
import { KvKeyPart } from "./KvKeyPart.tsx";

export function KvKey(
  { value, entry, showRoot, noLink }: {
    value: Signal<KvKeyJSON> | KvKeyJSON;
    entry?: Signal<KvKeyJSON | null>;
    showRoot?: boolean;
    noLink?: boolean;
  },
) {
  let key: KvKeyJSON;
  let isSignal;
  let onClick;
  if (Array.isArray(value)) {
    isSignal = false;
    key = value;
  } else {
    isSignal = true;
    key = value.value;
    if (!noLink) {
      onClick = (evt: Event) => {
        evt.preventDefault();
        if (entry) {
          entry.value = null;
        }
        value.value = [];
      };
    }
  }
  key = [...key];
  const children: ComponentChildren[] = [];
  let part;
  while ((part = key.pop())) {
    children.unshift(
      <KvKeyPart
        part={part}
        entry={entry}
        link={!noLink && isSignal
          ? [[...key, part], value as Signal<KvKeyJSON>]
          : undefined}
      />,
    );
  }
  if (showRoot) {
    children.unshift(
      <li class="bg-gray-100 text-gray-800 font-medium w-fit inline-block mx-1 px-2 rounded dark:(bg-gray-900 text-gray-300) align-middle">
        {onClick
          ? (
            <a href="#" onClick={onClick}>
              <IconHome size={4} />
            </a>
          )
          : <IconHome size={4} />}
      </li>,
    );
  }
  return (
    <ul class="whitespace-nowrap no-scrollbar overflow(x-scroll y-hidden)">
      {children}
    </ul>
  );
}
