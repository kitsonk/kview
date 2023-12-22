import { Head } from "$fresh/runtime.ts";
import { type RouteContext } from "$fresh/server.ts";
import { AppFrame } from "$components/AppFrame.tsx";
import KvExplorer from "$islands/KvExplorer.tsx";
import { getProjectDbs, getProjectDetails } from "$utils/dash.ts";

export default async function OrgKvBranch(
  _req: Request,
  { params: { name, branch }, renderNotFound }: RouteContext,
) {
  const projectDetail = await getProjectDetails(name);
  const isUser = projectDetail.organization.name === null;
  const dbs = await getProjectDbs(name);
  const db = dbs
    .find(({ branch: b }) => b === (branch === "preview" ? "*" : branch));

  if (!db) {
    return renderNotFound();
  }
  return (
    <AppFrame
      breadcrumbs={isUser
        ? [
          { href: "/user", text: "User" },
          { href: `/projects/${name}`, text: name },
          { href: `/projects/${name}/kv/${branch}`, text: branch },
        ]
        : [
          { href: "/orgs", text: "Organizations" },

          {
            href: `/orgs/${projectDetail.organization.id}`,
            text: projectDetail.organization.name ?? "",
          },
          { href: `/projects/${name}`, text: name },
          { href: `/projects/${name}/kv/${branch}`, text: branch },
        ]}
    >
      <Head>
        <title>
          {name}:{branch} &mdash; kview
        </title>
      </Head>
      <KvExplorer
        db={db}
        label={`${name}:${branch}`}
        href={`/projects/${name}/kv/${branch}`}
      />
    </AppFrame>
  );
}
