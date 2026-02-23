import { KvKeyPartJSON } from "@deno/kv-utils/json";

import { KvKeyPart } from "./KvKeyPart.tsx";

export function Path({ path }: { path: KvKeyPartJSON[] }) {
  return (
    <div class="breadcrumbs">
      <ul>
        <li>
          <span class="iconify lucide--house size-4"></span>
        </li>
        {path.map((keyPart, i) => (
          <li key={i}>
            <KvKeyPart keyPart={keyPart} />
          </li>
        ))}
      </ul>
    </div>
  );
}
