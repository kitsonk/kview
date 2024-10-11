import { asset } from "$fresh/runtime.ts";

export default function IconGit({ size = 6 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      class={`w-${size} h-${size}`}
      fill="currentColor"
    >
      <use
        href={`${asset("/sprites.svg")}#git`}
      />
    </svg>
  );
}
