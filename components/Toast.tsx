import { asset } from "$fresh/runtime.ts";
import { type Notification, state } from "$utils/state.ts";

const ICONS = {
  "success": (
    <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
      <svg
        class="w-5 h-5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
      >
        <use href={`${asset("/sprites.svg")}#check`} />
      </svg>
      <span class="sr-only">Check icon</span>
    </div>
  ),
  "error": (
    <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
      <svg
        class="w-5 h-5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
      >
        <use href={`${asset("/sprites.svg")}#error`} />
      </svg>
      <span class="sr-only">Error icon</span>
    </div>
  ),
  "warning": (
    <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200">
      <svg
        class="w-5 h-5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
      >
        <use href={`${asset("/sprites.svg")}#warning`} />
      </svg>
      <span class="sr-only">Warning icon</span>
    </div>
  ),
} as const;

export function Toast({ message, dismissible, type, id }: Notification) {
  return (
    <div
      class="flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 transition-all duration-500 ease-in-out"
      role="alert"
    >
      {ICONS[type]}
      <div class="ml-3 text-sm font-normal">{message}</div>
      {dismissible && (
        <button
          type="button"
          class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
          onClick={() => {
            state.notifications.value = state
              .notifications.value.filter(({ id: i }) => i !== id);
          }}
          aria-label="Close"
        >
          <span class="sr-only">Close</span>
          <svg
            class="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
          >
            <use href={`${asset("/sprites.svg")}#close_sm`} />
          </svg>
        </button>
      )}
    </div>
  );
}
