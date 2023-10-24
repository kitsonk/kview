import { Head } from "$fresh/runtime.ts";
import { AppFrame } from "$components/AppFrame.tsx";
import LocalKvList from "$islands/LocalKvList.tsx";
import { state } from "$utils/state.ts";
import { BreadcrumbItem } from "$components/Breadcrumbs.tsx";

export default function Local() {
  const breadcrumbs: BreadcrumbItem[] = [{ href: "/local", text: "Local" }];

  return (
    <AppFrame breadcrumbs={breadcrumbs}>
      <Head>
        <title>Local Stores &mdash; kview</title>
      </Head>
      {state.localStores.value
        ? <LocalKvList stores={state.localStores.value} />
        : undefined}
    </AppFrame>
  );
}
