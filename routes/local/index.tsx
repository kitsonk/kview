import { Head } from "$fresh/runtime.ts";
import { AppFrame } from "$components/AppFrame.tsx";
import LocalKvList from "$islands/LocalKvList.tsx";
import { state } from "$utils/state.ts";

export default function Local() {
  return (
    <AppFrame breadcrumbs={[{ href: "/local", text: "Local" }]}>
      <Head>
        <title>Local Stores &mdash; kview</title>
      </Head>
      <LocalKvList stores={state.localStores.value} />
    </AppFrame>
  );
}
