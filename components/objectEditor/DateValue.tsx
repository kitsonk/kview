import type { SignalLike } from "preact";
import { useSignal } from "@preact/signals";

export function DateValue({ value }: { value: SignalLike<Date | string> }) {
  const valueValue = value.peek();
  const editValue = useSignal(valueValue instanceof Date ? valueValue.toISOString().slice(0, -5) : String(valueValue));
  return (
    <input
      class="input input-sm validator w-full"
      name="property-value"
      id="property-value"
      value={editValue}
      type="text"
      pattern="\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z"
      required
      onInput={(evt) => {
        if (evt.currentTarget.checkValidity()) {
          try {
            editValue.value = evt.currentTarget.value;
            value.value = new Date(evt.currentTarget.value);
          } catch {
            // Ignore invalid input
          }
        }
      }}
    />
  );
}
