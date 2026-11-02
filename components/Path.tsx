import { KvKeyJSON } from "@deno/kv-utils/json";

import { KvKeyPart } from "./KvKeyPart.tsx";

export function Path({ path, onClick }: { path: KvKeyJSON; onClick?: (part: KvKeyJSON) => void }) {
  return (
    <div class="breadcrumbs">
      <ul>
        <li
          onClick={(evt) => {
            evt.preventDefault();
            onClick?.([]);
          }}
        >
          <span class="iconify lucide--house size-4"></span>
        </li>
        {path.map((keyPart, i) => (
          <li
            key={i}
            onClick={(evt) => {
              evt.preventDefault();
              onClick?.(path.slice(0, i + 1));
            }}
          >
            <KvKeyPart keyPart={keyPart} />
          </li>
        ))}
      </ul>
    </div>
  );
}
