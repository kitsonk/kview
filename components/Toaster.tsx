import { Toast } from "$components/Toast.tsx";
import { state } from "$utils/state.ts";

export function Toaster() {
  const children = state
    .notifications.value.map((props, idx) => <Toast key={idx} {...props} />);
  return (
    <div class="fixed right-5 bottom-5 md:w-72">
      {children}
    </div>
  );
}
