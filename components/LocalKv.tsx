import { useSignal, useSignalEffect } from "@preact/signals";
import { encodeBase64Url } from "@std/encoding/base64url";
import { format } from "@std/fmt/bytes";
import { type KvLocalInfo } from "$utils/kv.ts";

import { EditLabel } from "./EditLabel.tsx";
import IconKV from "./icons/KV.tsx";

export function LocalKv({ db: { name, id, size, path } }: { db: KvLocalInfo }) {
  const value = useSignal(name);
  const href = id === path ? encodeBase64Url(id) : id;

  useSignalEffect(() => {
    if (value.value && value.value !== name) {
      fetch(new URL("/api/local", import.meta.url), {
        method: "POST",
        body: JSON.stringify([id, value.value]),
        headers: { "Content-Type": "application/json" },
      });
    }
  });

  return (
    <li class="flex items-center border rounded p-2 hover:bg-gray-200 hover:dark:bg-gray-800">
      <a
        href={`/local/${href}`}
      >
        <div class="p-2">
          <IconKV size={12} />
        </div>
      </a>
      <div class="flex-grow-0 overflow-hidden px-2">
        <EditLabel
          value={value}
          labelClass="block font-semibold cursor-text w-full hover:bg-gray-300 dark:bg-gray-700 rounded select-none"
          inputClass="bg-gray-50 border border-gray-300 text-gray-900 rounded focus:ring-blue-500 focus:border-blue-500 px-2 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          emptyDisplay="[unnamed]"
        />
        <a
          href={`/local/${href}`}
        >
          <div class="text-gray-600 dark:text-gray-400 text-sm">
            {format(size)}
          </div>
          <div class="overflow-ellipsis overflow-hidden text-sm text-gray-600 dark:text-gray-400">
            {id}
          </div>
        </a>
      </div>
    </li>
  );
}
