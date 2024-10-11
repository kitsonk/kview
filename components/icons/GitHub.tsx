import { asset } from "$fresh/runtime.ts";

export default function IconGitHub({ size = 6 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class={`w-${size} h-${size}`}
      fill="currentColor"
    >
      <use
        href={`${asset("/sprites.svg")}#github`}
      />
    </svg>
  );
}
