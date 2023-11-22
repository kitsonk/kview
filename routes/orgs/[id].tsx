import { Head } from "$fresh/runtime.ts";
import { type RouteContext } from "$fresh/server.ts";
import { AppFrame } from "$components/AppFrame.tsx";
import { ProjectList } from "$components/ProjectList.tsx";
import { getOrganizationDetail, getRootData } from "$utils/dash.ts";

export default async function OrganizationDetails(
  _req: Request,
  { params: { id } }: RouteContext,
) {
  let { projects, name } = await getOrganizationDetail(id);
  const isUser = name === null;
  if (!isUser) {
    name = (await getRootData()).user.name;
  }

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
