import { AppFrame } from "$components/AppFrame.tsx";
import { OrgList } from "$components/OrgList.tsx";
import { User } from "$components/User.tsx";
import LocalKvList from "$islands/LocalKvList.tsx";
import RemoteKvList from "$islands/RemoteKvList.tsx";
import { getRootData } from "$utils/dash.ts";
import { state } from "$utils/state.ts";

export default async function Home() {
  const loggedIn = !!state.accessToken.value;
  let data;
  let user;
  if (loggedIn) {
    data = await getRootData();
    user = data.user;
  }
  return (
    <AppFrame>
      <LocalKvList />
      {user && (
        <div>
          <h1 class="text-xl font-bold py-2">User</h1>
          <User data={user} />
        </div>
      )}
      {data && <OrgList data={data} />}
      <RemoteKvList stores={state.remoteStores.value} />
    </AppFrame>
  );
}
