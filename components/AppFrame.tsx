import type { ComponentChildren } from "preact";

import { Footer } from "./Footer.tsx";
import { Sidebar } from "./Sidebar.tsx";
import { Topbar } from "./Topbar.tsx";

export function AppFrame({ children }: { children: ComponentChildren }) {
  return (
    <div class="size-full">
      <div class="flex">
        <input
          aria-label="Toggle layout sidebar"
          class="hidden"
          id="layout-sidebar-toggle-trigger"
          type="checkbox"
        />
        <input
          aria-label="Dense layout sidebar"
          class="hidden"
          id="layout-sidebar-hover-trigger"
          type="checkbox"
        />
        <div class="bg-base-300 h-screen w-1" id="layout-sidebar-hover"></div>
        <div class="overflow-hidden" id="layout-sidebar">
          <Sidebar />
        </div>
        <label for="layout-sidebar-toggle-trigger" id="layout-sidebar-backdrop"></label>

        <div class="flex h-screen min-w-0 grow flex-col overflow-auto">
          <div id="layout-topbar">
            <div class="h-full">
              <Topbar />
            </div>
          </div>
          <div id="layout-content">{children}</div>
          <div class="px-4 py-1">
            <div class="h-full">
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
