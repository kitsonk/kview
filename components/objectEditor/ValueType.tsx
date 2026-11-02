import type { SignalLike } from "preact";
import { CloneableTypes } from "@/components/objectEditor/utils.tsx";

export function ValueTypeEditor(
  { value }: { value: SignalLike<CloneableTypes> },
) {
  return (
    <select
      class="select select-sm"
      value={value}
      onChange={(evt) => value.value = evt.currentTarget.value as CloneableTypes}
    >
      <option value="string">String</option>
      <option value="number">Number</option>
      <option value="bigint">BigInt</option>
      <option value="boolean">Boolean</option>
      <option value="object">Object</option>
      <option value="Array">Array</option>
      <option value="RegExp">RegExp</option>
      <option value="Date">Date</option>
      <option value="Error">Error</option>
      <option value="EvalError">EvalError</option>
      <option value="RangeError">RangeError</option>
      <option value="ReferenceError">ReferenceError</option>
      <option value="SyntaxError">SyntaxError</option>
      <option value="TypeError">TypeError</option>
      <option value="URIError">URIError</option>
      <option value="Map">Map</option>
      <option value="Set">Set</option>
      <option value="null">Null</option>
      <option value="undefined">Undefined</option>
    </select>
  );
}
