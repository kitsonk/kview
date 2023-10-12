import { type ComponentChildren } from "preact";

import IconOrganization from "./icons/Organization.tsx";
import IconLogout from "./icons/Logout.tsx";

const ICONS = {
  "logout": <IconLogout size={6} />,
  "org": <IconOrganization size={6} />,
} as const;

export function NavItem(
  { children, count, icon, href = "#" }: {
    children: ComponentChildren;
    count?: number;
    icon: keyof typeof ICONS;
    href?: string;
  },
) {
  return (
    <li>
      <a
        href={href}
        class="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
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
