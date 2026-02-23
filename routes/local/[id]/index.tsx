import { AppFrame } from "@/components/AppFrame.tsx";
import KVExplorer from "@/islands/KVExplorer.tsx";
import { define } from "@/utils/fresh.ts";

export default define.page(function Index(_ctx) {
  return (
    <AppFrame>
      <div class="flex items-center justify-between">
        <div class="text-lg font-medium group flex">
          <div class="italic">[unnamed]</div>
          <div class="ml-2 opacity-0 group-hover:opacity-60 transition-opacity">
            <a href="#">
              <span class="iconify lucide--pen-line size-4"></span>
            </a>
          </div>
        </div>
        <div class="breadcrumbs hidden p-0 text-sm sm:inline">
          <ul>
            <li>
              <a href="/local">Local</a>
            </li>
            <li class="opacity-80">ecfcea9⋯</li>
          </ul>
        </div>
      </div>
      <KVExplorer />
    </AppFrame>
  );
});
