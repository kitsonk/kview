import type { SignalLike } from "preact";
import { useSignal } from "@preact/signals";

export function BigIntValue({ value }: { value: SignalLike<bigint> }) {
  const editValue = useSignal(String(value.peek()));
  return (
    <input
      class="input input-sm validator w-full"
      name="property-value"
      id="property-value"
      value={editValue}
      type="text"
      pattern="[+\-]?(0[xX][0-9a-fA-F]+|0[bB][01]+|0[oO][0-7]+|\d+)"
      required
      onInput={(evt) => {
        if (evt.currentTarget.checkValidity()) {
          try {
            const newValue = BigInt(evt.currentTarget.value);
            editValue.value = evt.currentTarget.value;
            value.value = newValue;
          } catch {
            // Ignore invalid input
          }
        }
      }}
    />
  );
}
