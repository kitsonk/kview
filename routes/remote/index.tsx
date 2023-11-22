import { AppFrame } from "$components/AppFrame.tsx";
import { Head } from "$fresh/runtime.ts";
import RemoteKvList from "$islands/RemoteKvList.tsx";
import { state } from "$utils/state.ts";

export default function Home() {
  return (
    <AppFrame
      breadcrumbs={[
        { href: "/remote", text: "Remote" },
      ]}
    >
      <Head>
        <title>Remote Stores &mdash; kview</title>
      </Head>
      <RemoteKvList stores={state.remoteStores.value} />
    </AppFrame>
  );
}
