import { Head } from "$fresh/runtime.ts";
import { type RouteContext } from "$fresh/server.ts";
import { AppFrame } from "$components/AppFrame.tsx";
import KvExplorer from "$islands/KvExplorer.tsx";
import { getProjectDbs } from "$utils/dash.ts";

export default async function OrgKvBranch(
  _req: Request,
  { params: { name, branch }, renderNotFound }: RouteContext,
) {
  const dbs = await getProjectDbs(name);
  const db = dbs
    .find(({ branch: b }) => b === (branch === "preview" ? "*" : branch));
  if (!db) {
    return renderNotFound();
  }
  return (
    <AppFrame>
      <Head>
        <title>
          {name}:{branch === "preview" ? "*" : branch} &mdash; kview
        </title>
      </Head>
      <KvExplorer db={db} />
    </AppFrame>
  );
}
