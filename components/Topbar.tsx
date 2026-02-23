export function Topbar() {
  return (
    <div class="flex h-full w-full items-center justify-between gap-4 px-4">
      <div class="flex items-center gap-3">
        <label
          class="btn btn-square btn-ghost btn-sm group-has-[[id=layout-sidebar-hover-trigger]:checked]/html:hidden"
          aria-label="Toggle sidebar"
          for="layout-sidebar-toggle-trigger"
        >
          <span class="iconify lucide--menu size-5"></span>
        </label>
        <label
          class="btn btn-square btn-ghost btn-sm hidden group-has-[[id=layout-sidebar-hover-trigger]:checked]/html:flex"
          aria-label="Leftmenu toggle"
          for="layout-sidebar-hover-trigger"
        >
          <span class="iconify lucide--menu size-5"></span>
        </label>
      </div>
      <div class="flex items-center gap-4">
        <div class="dropdown dropdown-bottom dropdown-end">
          <div tabindex={0} class="flex cursor-pointer items-center gap-2">
            <div class="avatar bg-base-200 rounded-box size-7 overflow-hidden">
              <img alt="Avatar" src="https://avatars.githubusercontent.com/u/1282577?v=4" />
            </div>
            <div>
              <p class="leading-none font-medium">Kitson Kelly</p>
              <p class="text-base-content/60 mt-0 text-xs/none">kitsonk</p>
            </div>
          </div>
          <div tabindex={0} class="dropdown-content bg-base-100 rounded-box mt-2 w-44 shadow">
            <ul class="menu w-full p-2">
              <li>
                <a class="text-error hover:bg-error/10" href="/disconnect">
                  <span class="iconify lucide--log-out size-4"></span>
                  <span>Disconnect</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
