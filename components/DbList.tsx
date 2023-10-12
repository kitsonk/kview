import { type DashDb } from "$utils/dash.ts";

import { Db } from "./Db.tsx";

export function DbList({ project, dbs }: { project: string; dbs: DashDb[] }) {
  if (!dbs.length) {
    return null;
  }
  return (
    <div>
      <h1 class="text-xl font-bold py-2">KV Databases</h1>
      <ul class="space-y-2">
        {dbs.map((db) => <Db project={project} db={db} />)}
      </ul>
    </div>
  );
}
