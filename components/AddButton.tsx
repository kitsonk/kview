import { type JSX } from "preact";

export function AddButton(
  {
    class: className,
    type = "submit",
    children,
    ...props
  }: JSX.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  return (
    <button
      class={`flex items-center justify-center font-bold text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800 ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
