import type { SignalLike } from "preact";
import { useSignal } from "@preact/signals";

export function NumberValue({ value }: { value: SignalLike<number | ""> }) {
  const editValue = useSignal(String(value.peek()));
  return (
    <input
      class="input input-sm validator w-full"
      name="property-value"
      id="property-value"
      value={editValue}
      type="text"
      pattern="[+\-]?(0[xX][0-9a-fA-F]+|0[bB][01]+|0[oO][0-7]+|\d+(\.\d+)?|Infinity|-Infinity|NaN)"
      required
      onInput={(evt) => {
        if (evt.currentTarget.checkValidity()) {
          const newValue = Number(evt.currentTarget.value);
          if (!isNaN(newValue)) {
            editValue.value = evt.currentTarget.value;
            value.value = newValue;
          } else if (evt.currentTarget.value === "NaN") {
            console.log("Setting value to NaN");
            editValue.value = evt.currentTarget.value;
            value.value = NaN;
          }
        }
      }}
    />
  );
}
