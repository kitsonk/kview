import type { SignalLike } from "preact";

export function KeyEditor({ value }: { value: SignalLike<string> }) {
  return (
    <input
      class="input input-sm validator"
      type="text"
      pattern="[\p{L}_$][\p{L}\p{N}_$]*"
      required
      value={value.value}
      onInput={(e) => (value.value = e.currentTarget.value)}
    />
  );
}
