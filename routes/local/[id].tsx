import { AppFrame } from "$components/AppFrame.tsx";
import { Head } from "$fresh/runtime.ts";
import { type RouteContext } from "$fresh/server.ts";
import KvExplorer from "$islands/KvExplorer.tsx";
import { state } from "$utils/state.ts";

export default function OrgKvBranch({ params: { id } }: RouteContext) {
  const name = state.localStores.value?.find(({ id: i }) => i === id)?.name;
  return (
    <AppFrame>
      <Head>
        <title>{name ?? `${id.slice(0, 6)}...`} &mdash; kview</title>
      </Head>
      <KvExplorer id={id} />
    </AppFrame>
  );
}
