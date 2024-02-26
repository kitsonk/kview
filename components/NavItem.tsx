import { type ComponentChildren } from "preact";

import IconDocs from "./icons/Docs.tsx";
import IconHome from "./icons/Home.tsx";
import IconLocal from "./icons/Local.tsx";
import IconLogin from "./icons/Login.tsx";
import IconLogout from "./icons/Logout.tsx";
import IconObserve from "./icons/Observe.tsx";
import IconOrganization from "./icons/Organization.tsx";
import IconRemote from "./icons/Remote.tsx";
import IconTask from "./icons/Task.tsx";
import IconUser from "./icons/User.tsx";

const ICONS = {
  "docs": <IconDocs />,
  "home": <IconHome />,
  "local": <IconLocal />,
  "login": <IconLogin />,
  "logout": <IconLogout />,
  "observe": <IconObserve />,
  "org": <IconOrganization />,
  "remote": <IconRemote />,
  "task": <IconTask />,
  "user": <IconUser />,
} as const;

export function NavItem(
  { children, count, icon, selected, href = "#" }: {
    children: ComponentChildren;
    count?: number;
    icon: keyof typeof ICONS;
    selected?: boolean;
    href?: string;
  },
) {
  return (
    <li>
      <a
        href={href}
        class={`flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white ${
          selected
            ? "dark:bg-gray-700 bg-gray-100"
            : "hover:dark:bg-gray-700 hover:bg-gray-100"
        } group`}
      >
        <span class="text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
          {ICONS[icon]}
        </span>
        <span class="ml-3">{children}</span>
        {count != null
          ? (
            <span class="inline-flex justify-center items-center w-5 h-5 text-xs font-semibold rounded-full text-primary-800 bg-primary-100 dark:bg-primary-200 dark:text-primary-800">
              {count}
            </span>
          )
          : undefined}
      </a>
    </li>
  );
}
