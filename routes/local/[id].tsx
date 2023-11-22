import { AppFrame } from "$components/AppFrame.tsx";
import { Head } from "$fresh/runtime.ts";
import { type RouteContext } from "$fresh/server.ts";
import KvExplorer from "$islands/KvExplorer.tsx";
import { state } from "$utils/state.ts";

function shortenHash(hash: string) {
  if (hash.length <= 12) return hash;
  return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
}

export default function Local({ params: { id } }: RouteContext) {
  const name = state.localStores.value?.find(({ id: i }) => i === id)?.name;

  return (
    <AppFrame
      breadcrumbs={[
        { href: "/local", text: "Local" },
        { href: `/local/${id}`, text: name ?? shortenHash(id) },
      ]}
    >
      <Head>
        <title>{name ?? `${id.slice(0, 6)}...`} &mdash; kview</title>
      </Head>
      <KvExplorer id={id} />
    </AppFrame>
  );
}
