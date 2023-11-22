import { Head } from "$fresh/runtime.ts";
import { AppFrame } from "$components/AppFrame.tsx";
import LocalKvList from "$islands/LocalKvList.tsx";

export default function Local() {
  return (
    <AppFrame breadcrumbs={[{ href: "/local", text: "Local" }]}>
      <Head>
        <title>Local Stores &mdash; kview</title>
      </Head>
      <LocalKvList />
    </AppFrame>
  );
}
