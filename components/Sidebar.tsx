import type { ComponentChildren } from "preact";

function MenuItem({ icon, label, href }: { icon: string; label: string; href: string }) {
  return (
    <a class="menu-item" href={href}>
      <span class={`iconify lucide--${icon} size-4`}></span>
      <span class="grow">{label}</span>
    </a>
  );
}

function CollapseMenuItem({ icon, label, children }: { icon: string; label: string; children: ComponentChildren }) {
  return (
    <div class="collapse">
      <input aria-label="Sidemenu item trigger" class="peer" type="checkbox" />
      <div class="collapse-title px-2.5 py-1.5">
        <span class={`iconify lucide--${icon} size-4`}></span>
        <span class="grow">{label}</span>
        <span class="iconify lucide--chevron-right arrow-icon size-3.5"></span>
      </div>
      <div class="collapse-content ms-6.5 p-0!">
        <div class="mt-0.5 space-y-0.5">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <div class="flex h-full w-full flex-col py-3">
      <div class="flex min-h-10 items-center gap-3 px-5">
        <img alt="kview Logo" class="h-7 w-7" src="/logo.svg" />
        <hr class="border-base-300 h-5 border-e" />
        <span class="text-xl font-semibold">kview</span>
      </div>
      <div class="sidebar-menu grow overflow-auto px-2.5">
        <label
          for="layout-sidebar-hover-trigger"
          title="Toggle sidebar hover"
          class="btn btn-circle btn-ghost btn-sm text-base-content/50 absolute end-2 top-3.5 max-lg:hidden"
        >
          <span class="iconify lucide--panel-left-close absolute size-4.5 opacity-100 transition-all duration-300 group-has-[[id=layout-sidebar-hover-trigger]:checked]/html:opacity-0">
          </span>
          <span class="iconify lucide--panel-left-dashed absolute size-4.5 opacity-0 transition-all duration-300 group-has-[[id=layout-sidebar-hover-trigger]:checked]/html:opacity-100">
          </span>
        </label>
        <p class="menu-label mt-2 px-2.5">Navigation</p>
        <div class="mt-2">
          <MenuItem icon="house" label="Home" href="/" />
        </div>
        <p class="menu-label mt-2 px-2.5">Stores</p>
        <div class="mt-2 space-y-0.5">
          <MenuItem icon="arrow-down-to-dot" label="Local" href="/local" />
          <MenuItem icon="user" label="User" href="/org/kitsonk" />
          <CollapseMenuItem icon="building-2" label="Organizations">
            <MenuItem icon="building-2" label="higher-order-testing" href="/org/higher-order-testing" />
            <MenuItem icon="building-2" label="ctolabs" href="/org/ctolabs" />
            <MenuItem icon="building-2" label="tswhy" href="/org/tswhy" />
            <MenuItem icon="building-2" label="oak" href="/org/oak" />
          </CollapseMenuItem>
          <MenuItem icon="router" label="Remote" href="/remote" />
        </div>
        <p class="menu-label mt-2 px-2.5">Manage</p>
        <div class="mt-2 space-y-0.5">
          <MenuItem icon="cable" label="Connect to Deploy" href="/connect" />
          <MenuItem icon="view" label="Watches" href="/watches" />
          <MenuItem icon="list-checks" label="Jobs" href="/jobs" />
          <MenuItem icon="book-text" label="Documentation" href="/docs" />
        </div>
      </div>
    </div>
  );
}
