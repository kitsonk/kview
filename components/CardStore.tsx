import { format } from "@std/fmt/bytes";

export function CardStore({ id, name, size }: { id: string; name?: string; size: number }) {
  return (
    <div class="card card-border bg-base-200">
      <div class="card-body p-3">
        <div class="flex items-center gap-2">
          <div class="rounded-box bg-primary/5 text-primary flex items-center p-1.5">
            <span class="iconify lucide--archive size-5"></span>
          </div>
          <span class="text-sm font-medium">
            <a href={`/local/${id}`} class="underline-offset-4 hover:underline">
              {name ?? <span class="text-base-content/80 italic">[unnamed]</span>}
            </a>
          </span>
          <div class="ms-auto">
            <div class="dropdown dropdown-bottom dropdown-center">
              <div
                tabindex={0}
                role="button"
                class="btn btn-ghost btn-circle btn-sm"
                aria-label="Menu"
              >
                <span class="iconify lucide--more-vertical size-4"></span>
              </div>
              <div
                tabindex={0}
                class="dropdown-content bg-base-100 rounded-box mt-2 w-52 shadow"
              >
                <ul class="menu w-full p-1.5">
                  <li>
                    <div>
                      <span class="iconify lucide--pen-line size-4"></span>
                      Rename
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="text-base-content/70 mt-2 flex items-center text-xs overflow-hidden">
          <span class="truncate text-ellipsis whitespace-nowrap">
            {id}
          </span>
        </div>
        <div class="text-base-content/70 flex items-center text-xs">
          {format(size)}
        </div>
      </div>
    </div>
  );
}
