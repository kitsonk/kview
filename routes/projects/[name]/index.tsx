import { Head } from "$fresh/runtime.ts";
import { type RouteContext } from "$fresh/server.ts";
import { AppFrame } from "$components/AppFrame.tsx";
import { DbList } from "$components/DbList.tsx";
import { getProjectDbs, getProjectDetails } from "$utils/dash.ts";

export default async function OrganizationDetails(
  _req: Request,
  { params: { name } }: RouteContext,
) {
  const projectDetail = await getProjectDetails(name);
  const isUser = projectDetail.organization.name === null;
  const dbs = await getProjectDbs(name);

  return (
    <AppFrame
      breadcrumbs={isUser
        ? [
          { href: "/user", text: "User" },
          { href: `/projects/${name}`, text: name },
        ]
        : [
          { href: "/orgs", text: "Organizations" },
          {
            href: `/orgs/${projectDetail.organization.id}`,
            text: projectDetail.organization.name ?? "",
          },
          { href: `/projects/${name}`, text: name },
        ]}
    >
      <Head>
        <title>{name} &mdash; kview</title>
      </Head>
      <DbList project={name} dbs={dbs} />
    </AppFrame>
  );
}
