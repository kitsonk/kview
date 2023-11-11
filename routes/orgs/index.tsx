import { Head } from "$fresh/runtime.ts";
import { AppFrame } from "$components/AppFrame.tsx";
import { OrgList } from "$components/OrgList.tsx";
import { getRootData } from "$utils/dash.ts";
import { BreadcrumbItem } from "$components/Breadcrumbs.tsx";

export default async function Home() {
  const data = await getRootData();
  const breadcrumbs: BreadcrumbItem[] = [
    { href: "/orgs", text: "Organizations" },
  ];
  return (
    <AppFrame breadcrumbs={breadcrumbs}>
      <Head>
        <title>Organizations &mdash; kview</title>
      </Head>
      <OrgList data={data} />
    </AppFrame>
  );
}
