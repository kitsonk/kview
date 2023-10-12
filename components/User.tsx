import { type DashUser } from "$utils/dash.ts";
import IconGitHub from "./icons/GitHub.tsx";

export function User(
  { data: { login, name, avatarUrl, pro, id }, noLink }: {
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
        <div class="text-gray(600 dark:400) flex items-center">
          <IconGitHub />
          <span class="mx-2 block">{login}</span>
        </div>
      </div>
      {pro
        ? (
          <div class="rounded-full px-2 bg-primary-500 text-gray-900">
            PRO
          </div>
        )
        : null}
    </>
  );
  if (noLink) {
    return <div class="flex items-center border rounded p-2">{children}</div>;
  } else {
    return (
      <a
        href={`/orgs/${id}`}
        class="flex items-center border rounded p-2 hover:bg-gray(200 dark:800)"
      >
        {children}
      </a>
    );
  }
}
