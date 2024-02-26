import { AppFrame } from "$components/AppFrame.tsx";
import { Head } from "$fresh/runtime.ts";
import { type RouteContext } from "$fresh/server.ts";
import KvExplorer from "$islands/KvExplorer.tsx";
import LocalControls from "$islands/LocalControls.tsx";
import { encodeBase64Url } from "$std/encoding/base64url.ts";
import { format } from "$std/fmt/bytes.ts";
import { state } from "$utils/state.ts";

function shortenHash(hash: string) {
  if (hash.length <= 12) return hash;
  return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
}

// deno-lint-ignore require-await
export default async function Local(
  _req: Request,
  { params: { id }, renderNotFound }: RouteContext,
) {
  const store = state.localStores.value?.find(({ id: i }) =>
    i === id || encodeBase64Url(i) === id
  );

  if (!store) {
    return renderNotFound();
  }

  const label = store.name ??
    (store.id === id ? shortenHash(id) : store.id);

  return (
    <AppFrame
      breadcrumbs={[
        { href: "/local", text: "Local" },
        { href: `/local/${id}`, text: label },
      ]}
    >
      <Head>
        <title>{label} &mdash; kview</title>
      </Head>
      <div class="md:col-span-2 border rounded p-2">
        <table class="w-full truncate">
          <tbody>
            <tr>
              <td class="font-bold">Name</td>
              <td>{store.name}</td>
            </tr>
            <tr>
              <td class="font-bold">Path</td>
              <td class="truncate max-w-xs md:max-w-sm lg:max-w-md">
                {store.path}
              </td>
            </tr>
            <tr>
              <td class="font-bold">Size</td>
              <td>{format(store.size)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <LocalControls store={store} />
      <KvExplorer id={id} label={label} href={`/local/${id}`} />
    </AppFrame>
  );
}
