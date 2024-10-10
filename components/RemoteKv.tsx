import { encodeBase64Url } from "@std/encoding/base64url";
import { type RemoteStoreInfo } from "$utils/remoteStores.ts";

import IconRemote from "./icons/Remote.tsx";

export function RemoteKv({ db: { name, url } }: { db: RemoteStoreInfo }) {
  return (
    <li>
      <a
        class="flex items-center border rounded p-2 hover:bg-gray-200 dark:bg-gray-800"
        href={`/remote/${encodeBase64Url(url)}`}
      >
        <div class="p-2">
          <IconRemote size={12} />
        </div>
        <div class="flex-grow-0 overflow-hidden px-2">
          <div class="font-semibold">
            {name || url}
          </div>
          {name && (
            <div class="overflow-ellipsis overflow-hidden text-sm text-gray-600 dark:text-gray-400">
              {url}
            </div>
          )}
        </div>
      </a>
    </li>
  );
}
