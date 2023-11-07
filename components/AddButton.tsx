import { type JSX } from "preact";

export function AddButton(
  {
    class: className,
    type = "submit",
    children,
    ...props
  }: JSX.HTMLAttributes<HTMLButtonElement>,
) {
  return (
    <button
      class={`flex items-center justify-center font-bold text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800 ${className}`}
      type={type}
      {...props}
    >
      <svg
        class="mr-1 -ml-1 w-6 h-6"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
          clip-rule="evenodd"
        >
        </path>
      </svg>
      {children}
    </button>
  );
}
