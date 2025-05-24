import IconKV from "$components/icons/KV.tsx";
import { format } from "@std/fmt/bytes";
import { type DashDb } from "$utils/dash.ts";

export function Db(
  { project, db: { branch, sizeBytes } }: { project: string; db: DashDb },
) {
  return (
    <li>
      <a
        href={`/projects/${project}/kv/${branch === "*" ? "preview" : branch}`}
        class="flex items-center border rounded p-4 hover:bg-gray-200 hover:dark:bg-gray-800"
      >
        <IconKV size={12} />
        <div class="px-4">
          <div class="text-xl">
            {branch === "*" ? <span class="italic">preview</span> : <span class="font-bold">{branch}</span>}
          </div>
          <div class="text-gray-600 dark:text-gray-400 text-sm">
            {format(sizeBytes)}
          </div>
        </div>
      </a>
    </li>
  );
}
