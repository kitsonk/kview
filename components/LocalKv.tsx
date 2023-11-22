import { format } from "$std/fmt/bytes.ts";
import { type KvLocalInfo } from "$utils/kv.ts";
import { useSignal, useSignalEffect } from "@preact/signals";

import { EditLabel } from "./EditLabel.tsx";
import IconKV from "./icons/KV.tsx";

export function LocalKv({ db: { name, id, size } }: { db: KvLocalInfo }) {
  const value = useSignal(name);

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
    <li class="flex items-center border rounded p-2 hover:bg-gray(200 dark:800)">
      <a
        href={`/local/${id}`}
      >
        <div class="p-2">
          <IconKV size={12} />
        </div>
      </a>
      <div class="flex-grow-0 overflow-hidden px-2">
        <EditLabel
          value={value}
          labelClass="block font-semibold cursor-text w-full hover:bg-gray(300 dark:700) rounded"
          inputClass="bg-gray-50 border border-gray-300 text-gray-900 rounded focus:ring-blue-500 focus:border-blue-500 px-2 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          emptyDisplay="[unnamed]"
        />
        <a
          href={`/local/${id}`}
        >
          <div class="text-gray(600 dark:400) text-sm">{format(size)}</div>
          <div class="overflow-ellipsis overflow-hidden text-sm text-gray(600 dark:400)">
            {id}
          </div>
        </a>
      </div>
    </li>
  );
}
