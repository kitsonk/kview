import { type ComponentChildren } from "preact";

export function Label(
  { for: for_, children }: { for: string; children: ComponentChildren },
) {
  return (
    <label
      for={for_}
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    >
      {children}
    </label>
  );
}
