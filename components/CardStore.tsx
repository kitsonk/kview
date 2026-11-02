import { format } from "@std/fmt/bytes";

import CardStoreMenu from "@/islands/CardStoreMenu.tsx";

export function CardStore({ id, name, size }: { id: string; name?: string; size: number }) {
  return (
    <div class="card card-border bg-base-200">
      <div class="card-body p-3">
        <div class="flex items-center gap-2">
          <div class="rounded-box bg-primary/5 text-primary flex items-center p-1.5">
            <span class="iconify lucide--archive size-5"></span>
          </div>
          <CardStoreMenu id={id} initialName={name} />
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
