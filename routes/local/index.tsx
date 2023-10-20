import { Head } from "$fresh/runtime.ts";
import { AppFrame } from "$components/AppFrame.tsx";
import LocalKvList from "$islands/LocalKvList.tsx";
import { state } from "$utils/state.ts";

export default function Local() {
  return (
    <AppFrame>
      <Head>
        <title>Local Stores &mdash; kview</title>
      </Head>
      {state.localStores.value
        ? <LocalKvList stores={state.localStores.value} />
        : undefined}
    </AppFrame>
  );
}
