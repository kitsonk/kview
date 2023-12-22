import { Head } from "$fresh/runtime.ts";
import { AppFrame } from "$components/AppFrame.tsx";
import { OrgList } from "$components/OrgList.tsx";
import { getRootData } from "$utils/dash.ts";

export default async function Home() {
  const data = await getRootData();
  return (
    <AppFrame
      breadcrumbs={[{ href: "/orgs", text: "Organizations" }]}
      selected="orgs"
    >
      <Head>
        <title>Organizations &mdash; kview</title>
      </Head>
      <OrgList data={data} />
    </AppFrame>
  );
}
