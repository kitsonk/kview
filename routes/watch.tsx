import { Head } from "$fresh/runtime.ts";
import { AppFrame } from "$components/AppFrame.tsx";
import Watches from "$islands/Watches.tsx";

export default function Local() {
  return (
    <AppFrame
      breadcrumbs={[{ href: "/watch", text: "Watches" }]}
      selected="watches"
    >
      <Head>
        <title>Watches &mdash; kview</title>
      </Head>
      <Watches />
    </AppFrame>
  );
}
