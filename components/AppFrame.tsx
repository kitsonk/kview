import { type ComponentChildren } from "preact";
import { apply, tw } from "twind";
import { css } from "twind/css";
import { state } from "$utils/state.ts";

import { NavItem } from "./NavItem.tsx";

const dialogCss = css({
  "dialog::backdrop":
    apply`backdrop-filter backdrop-brightness-50 backdrop-grayscale`,
});

export function AppFrame(
  { children }: { children: ComponentChildren },
) {
  return (
    <div class={tw`${dialogCss} antialiased bg-gray(50 dark:900)`}>
      <nav class="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50">
        <div class="flex flex-wrap justify-between items-center">
          <div class="flex justify-start items-center">
            <a
              href="/"
              class="flex items-center justify-between mr-4"
            >
              <img
                src="/logo.svg"
                class="mr-3 h-8"
                alt="kview Logo"
              />
              <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                kview
              </span>
            </a>
          </div>
        </div>
      </nav>
      {/* Sidebar */}
      <aside
        class="fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidenav"
        id="drawer-navigation"
      >
        <div class="overflow-y-auto py-5 px-3 h-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <ul class="space-y-2">
            <NavItem icon="home" href="/">Home</NavItem>
            {state.localStores.value?.length
              ? <NavItem icon="local" href="/local">Local</NavItem>
              : undefined}
            {state.accessToken.value
              ? (
                <>
                  <NavItem icon="user" href="/user">User</NavItem>
                  <NavItem icon="org" href="/orgs">Organizations</NavItem>
                  <NavItem icon="logout" href="/logout">Logout</NavItem>
                </>
              )
              : <NavItem icon="login" href="/login">Login</NavItem>}
          </ul>
          <ul class="pt-5 mt-5 space-y-2 border-t border-gray-200 dark:border-gray-700">
            <NavItem icon="docs" href="/docs">Docs</NavItem>
          </ul>
        </div>
      </aside>

      <main class="p-4 md:ml-64 h-auto pt-20">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {children}
        </div>
      </main>
    </div>
  );
}
