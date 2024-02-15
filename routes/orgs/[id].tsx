import { Head } from "$fresh/runtime.ts";
import { type RouteContext } from "$fresh/server.ts";
import { AppFrame } from "$components/AppFrame.tsx";
import { ProjectList } from "$components/ProjectList.tsx";
import { getOrganizationDetail, getRootData } from "$utils/dash.ts";

export default async function OrganizationDetails(
  _req: Request,
  { params: { id } }: RouteContext,
) {
  const { organization } = await getOrganizationDetail(id);
  const projects = organization.projects ?? [];
  const name = organization.name ?? (await getRootData()).user.name;
  const isUser = organization.name === null;

  return (
    <AppFrame
      breadcrumbs={isUser
        ? [
          { href: "/user", text: "User" },
        ]
        : [
          { href: "/orgs", text: "Organizations" },
          { href: `/orgs/${id}`, text: name! },
        ]}
    >
      <Head>
        <title>{name} &mdash; kview</title>
      </Head>
      <div>
        <ProjectList projects={projects} />
      </div>
    </AppFrame>
  );
}
