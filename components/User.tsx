import { type DashUser } from "$utils/dash.ts";

import { PlanTag } from "./PlanTag.tsx";
import IconGitHub from "./icons/GitHub.tsx";

export function User(
  { data: { login, name, avatarUrl, subscription: { plan }, id }, noLink }: {
    data: DashUser;
    noLink?: boolean;
  },
) {
  const children = (
    <>
      <img
        src={avatarUrl}
        class="w-16 h-16 rounded-full block"
        alt={`${name}'s Avatar`}
      />
      <div class="px-4">
        <div class="text-xl font-bold">{name}</div>
        <div class="text-gray-600 dark:text-gray-400 flex items-center">
          <IconGitHub />
          <span class="mx-2 block">{login}</span>
        </div>
      </div>
      <PlanTag plan={plan} />
    </>
  );
  if (noLink) {
    return <div class="flex items-center border rounded p-2">{children}</div>;
  } else {
    return (
      <a
        href={`/orgs/${id}`}
        class="flex items-center border rounded p-2 hover:bg-gray-200 hover:dark:bg-gray-800"
      >
        {children}
      </a>
    );
  }
}
