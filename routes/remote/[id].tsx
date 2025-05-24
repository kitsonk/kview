import { AppFrame } from "$components/AppFrame.tsx";
import { Head } from "$fresh/runtime.ts";
import { type RouteContext } from "$fresh/server.ts";
import KvExplorer from "$islands/KvExplorer.tsx";
import RemoteControls from "$islands/RemoteControls.tsx";
import { decodeRemoteId } from "$utils/remoteStores.ts";
import { state } from "$utils/state.ts";

// deno-lint-ignore require-await
export default async function Remote(
  _req: Request,
  { params: { id }, renderNotFound }: RouteContext,
) {
  const storeId = decodeRemoteId(id);
  const store = state.remoteStores.value.find(({ url }) => url === storeId);
  if (!store) {
    return renderNotFound();
  }

  return (
    <AppFrame
      breadcrumbs={[
        { href: "/remote", text: "Remote" },
        { href: `/remote/${id}`, text: store.name ?? store.url },
      ]}
    >
      <Head>
        <title>{store.name ?? store.url} &mdash; kview</title>
      </Head>
      <div class="md:col-span-2 border rounded p-2">
        <table class="w-full">
          <tbody>
            <tr>
              <td class="font-bold">URL</td>
              <td>{store.url}</td>
            </tr>
            <tr>
              <td class="font-bold">Name</td>
              <td>{store.name ?? <span class="italic">[empty]</span>}</td>
            </tr>
            <tr>
              <td class="font-bold">Access Token</td>
              <td>
                {store.accessToken.length > 9
                  ? `${store.accessToken.slice(0, 3)}...${store.accessToken.slice(-3)}`
                  : `${store.accessToken.slice(0, 3)}...`}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <RemoteControls store={store} />
      <KvExplorer
        id={id}
        label={store.name ?? store.url}
        href={`/remote/${id}`}
      />
    </AppFrame>
  );
}
