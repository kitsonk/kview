import { asset } from "$fresh/runtime.ts";
import { type JSX } from "preact";

export function CloseButton(
  {
    class: className,
    type = "button",
    ...props
  }: JSX.HTMLAttributes<HTMLButtonElement>,
) {
  return (
    <button
      type={type}
      class={`text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white ${className}`}
      {...props}
    >
      <svg
        aria-hidden="true"
        class="w-5 h-5"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <use href={`${asset("/sprites.svg")}#close`} />
      </svg>
      <span class="sr-only">Close modal</span>
    </button>
  );
}
