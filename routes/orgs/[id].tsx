import { type RouteContext } from "$fresh/server.ts";
import { AppFrame } from "$components/AppFrame.tsx";
import { ProjectList } from "$components/ProjectList.tsx";
import { getOrganizationDetail } from "$utils/dash.ts";

export default async function OrganizationDetails(
  _req: Request,
  { params: { id } }: RouteContext,
) {
  const { projects } = await getOrganizationDetail(id);
  return (
    <AppFrame>
      <div>
        <ProjectList projects={projects} />
      </div>
    </AppFrame>
  );
}
