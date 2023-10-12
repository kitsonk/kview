import { AppFrame } from "$components/AppFrame.tsx";
import { OrgList } from "$components/OrgList.tsx";
import { getRootData } from "$utils/dash.ts";

export default async function Home() {
  const data = await getRootData();
  return (
    <AppFrame>
      <OrgList data={data} />
    </AppFrame>
  );
}
