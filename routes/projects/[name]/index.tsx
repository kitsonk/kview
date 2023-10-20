import { Head } from "$fresh/runtime.ts";
import { type RouteContext } from "$fresh/server.ts";
import { AppFrame } from "$components/AppFrame.tsx";
import { DbList } from "$components/DbList.tsx";
import { getProjectDbs } from "$utils/dash.ts";

export default async function OrganizationDetails(
  _req: Request,
  { params: { name } }: RouteContext,
) {
  const dbs = await getProjectDbs(name);
  return (
    <AppFrame>
      <Head>
        <title>{name} &mdash; kview</title>
      </Head>
      <DbList project={name} dbs={dbs} />
    </AppFrame>
  );
}
