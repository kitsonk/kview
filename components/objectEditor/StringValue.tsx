import type { SignalLike } from "preact";

export function StringValue({ value }: { value: SignalLike<string> }) {
  const stringValue = String(value.value);
  return (
    <input
      class="input input-sm w-full"
      type="text"
      value={stringValue}
      required
      onInput={(evt) => value.value = evt.currentTarget.value}
    />
  );
}
