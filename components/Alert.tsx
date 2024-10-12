import { asset } from "$fresh/runtime.ts";
import { type ComponentChildren } from "preact";
import { type Signal } from "@preact/signals";

export function ErrorAlert(
  { children }: { children: Signal<ComponentChildren> },
) {
  if (!children.value) {
    return null;
  }
  return (
    <div
      class="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
      role="alert"
    >
      <svg
        class="flex-shrink-0 inline w-4 h-4 mr-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
      >
        <use href={`${asset("/sprites.svg")}#alert`} />
      </svg>
      <span class="sr-only">Error</span>
      <div>
        {children}
      </div>
    </div>
  );
}

export function SuccessAlert(
  { children }: { children: Signal<ComponentChildren> },
) {
  if (!children.value) {
    return null;
  }
  return (
    <div
      class="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
      role="alert"
    >
      <svg
        class="flex-shrink-0 inline w-4 h-4 me-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
      >
        <use href={`${asset("/sprites.svg")}#alert`} />
      </svg>
      <span class="sr-only">Info</span>
      <div>
        {children}
      </div>
    </div>
  );
}
