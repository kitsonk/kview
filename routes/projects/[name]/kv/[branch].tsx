import { type RouteContext } from "$fresh/server.ts";
import { AppFrame } from "$components/AppFrame.tsx";
import KeyExplorer from "$islands/KeyExplorer.tsx";
import { getProjectDbs, getProjectDetails } from "$utils/dash.ts";

export default async function OrganizationDetails(
  _req: Request,
  { params: { name, branch }, renderNotFound }: RouteContext,
) {
  const project = await getProjectDetails(name);
  const dbs = await getProjectDbs(name);
  const db = dbs
    .find(({ branch: b }) => b === (branch === "preview" ? "*" : branch));
  if (!db) {
    return renderNotFound();
  }
  return (
    <AppFrame>
      <KeyExplorer db={db} project={project} />
    </AppFrame>
  );
}
