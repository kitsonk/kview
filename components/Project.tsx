import IconGit from "./icons/Git.tsx";
import IconPlayground from "./icons/Playground.tsx";

import { type DashProject } from "$utils/dash.ts";

export function Project({ project: { name, type } }: { project: DashProject }) {
  return (
    <li>
      <a
        href={`/projects/${name}`}
        class="flex items-center border rounded p-4 hover:bg-gray(200 dark:800)"
      >
        {type === "git" ? <IconGit size={10} /> : <IconPlayground size={10} />}
        <div class="px-4 text-lg">{name}</div>
      </a>
    </li>
  );
}
