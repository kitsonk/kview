import { AppFrame } from "@/components/AppFrame.tsx";
import { ListLocalStores } from "@/components/ListLocalStores.tsx";
import { define } from "@/utils/fresh.ts";
import { appState } from "@/utils/state.ts";

export default define.page(function Index() {
  return (
    <AppFrame>
      <div class="flex items-center justify-between">
        <p class="text-lg font-medium">Local</p>
      </div>
      <ListLocalStores localStores={appState.localStores.value} />
    </AppFrame>
  );
});
