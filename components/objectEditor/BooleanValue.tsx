import type { SignalLike } from "preact";
import { useSignal } from "@preact/signals";

export function BooleanValue({ value }: { value: SignalLike<boolean> }) {
  const editValue = useSignal(String(value.peek()));
  return (
    <select
      class="select select-sm"
      value={editValue}
      onChange={(evt) => value.value = evt.currentTarget.value === "true"}
    >
      <option value="true">true</option>
      <option value="false">false</option>
    </select>
  );
}
