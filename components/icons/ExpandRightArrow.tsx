import { asset } from "$fresh/runtime.ts";

export default function IconExpandRightArrow({ size = 6 }: { size?: number }) {
  return (
    <svg
      class={`w-${size} h-${size}`}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <use
        href={`${asset("/sprites.svg")}#ic-baseline-arrow-right`}
      />
    </svg>
  );
}
