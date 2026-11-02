import type { SignalLike } from "preact";
import { useSignal } from "@preact/signals";

export function RegExpValue({ value }: { value: SignalLike<RegExp> }) {
  const editValue = useSignal(String(value.peek()));
  return (
    <input
      class="input input-sm validator w-full"
      name="property-value"
      id="property-value"
      value={editValue}
      type="text"
      pattern="\/(?![*+?])([^\r\n\[\/\\]|\\.|\[([^\r\n\]\\]|\\.)*\])+/(g(im?|mi?)?|i(gm?|mg?)?|m(gi?|ig?)?)?"
      required
      onInput={(evt) => {
        if (evt.currentTarget.checkValidity()) {
          try {
            editValue.value = evt.currentTarget.value;
            const parts = evt.currentTarget.value.split("/");
            const flags = parts.pop();
            const [, ...pattern] = parts;
            value.value = new RegExp(pattern.join("/"), flags);
          } catch {
            // Ignore invalid input
          }
        }
      }}
    />
  );
}
