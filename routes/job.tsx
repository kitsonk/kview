import { Head } from "$fresh/runtime.ts";
import { AppFrame } from "$components/AppFrame.tsx";
import { Jobs } from "$components/Jobs.tsx";

export default function JobsView() {
  return (
    <AppFrame
      breadcrumbs={[{ href: "/job", text: "Jobs" }]}
      selected="jobs"
    >
      <Head>
        <title>Jobs &mdash; kview</title>
      </Head>
      <Jobs />
    </AppFrame>
  );
}
