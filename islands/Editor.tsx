import { useSignal, useSignalEffect } from "@preact/signals";
import { ObjectValue } from "@/components/objectEditor/ObjectValue.tsx";

export default function Editor() {
  const value = useSignal({ foo: "bar", nested: { a: 1, b: true, c: ["a", "b", true, /abc/i] } });
  useSignalEffect(() => {
    console.log("Value changed:", value.value);
  });
  return (
    <div class="flex h-full items-center justify-center">
      <ObjectValue value={value} root />
    </div>
  );
}
