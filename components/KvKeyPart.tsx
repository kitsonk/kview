import { type KvKeyJSON, type KvKeyPartJSON } from "@kitsonk/kv-toolbox/json";
import { type Signal } from "@preact/signals";

export function KvKeyPart(
  { part: { type, value }, entry, link }: {
    part: KvKeyPartJSON;
    entry?: Signal<KvKeyJSON | null>;
    link?: [KvKeyJSON, Signal<KvKeyJSON>];
  },
) {
  let onClick;
  if (link) {
    const [key, currentKey] = link;
    onClick = (evt: Event) => {
      evt.preventDefault();
      if (entry) {
        entry.value = [...key];
      }
      currentKey.value = key;
    };
  }
  let children = value;
  let color = "blue";
  switch (type) {
    case "Uint8Array":
      children = "Uint8Array";
      color = "gray";
      break;
    case "bigint":
      children = `${value}n`;
      color = "indigo";
      break;
    case "boolean":
      children = String(value);
      color = "green";
      break;
    case "number":
      children = String(value);
      color = "purple";
      break;
  }
  return (
    <li
      class={`bg-${color}-100 dark:bg-${color}-900 text-${color}-800 dark:text-${color}-300 font-medium w-fit inline-block mx-1 px-2.5 py-0.5 rounded`}
    >
      {onClick ? <a href="#" onClick={onClick}>{children}</a> : children}
    </li>
  );
}
