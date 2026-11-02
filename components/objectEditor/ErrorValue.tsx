import type { SignalLike } from "preact";

import { useSignal, useSignalEffect } from "@preact/signals";

import type { Cloneable, CloneableError } from "./utils.tsx";

import { ElementEditor } from "./Element.tsx";

export function ErrorValue({ value }: { value: SignalLike<CloneableError> }) {
  const message = useSignal(value.peek().message);
  const stack = useSignal(value.peek().stack);
  const cause = useSignal<Cloneable | undefined>(value.peek().cause as Cloneable | undefined);
  const ErrorConstructor: new (message: string) => CloneableError = Object.getPrototypeOf(value.peek()).constructor;
  useSignalEffect(() => {
    const err = new ErrorConstructor(message.value);
    if (stack.value) {
      err.stack = stack.value;
    }
    if (cause.value !== undefined) {
      err.cause = cause.value;
    } else {
      delete err.cause;
    }
    value.value = err;
  });
  return (
    <div class="border border-base-300 rounded p-2 space-y-2 my-2 ml-4">
      <label class="input input-sm w-full">
        <span class="iconify lucide--triangle-alert h-[1em] opacity-50"></span>
        <input
          type="text"
          name="valueMessage"
          value={message}
          placeholder="Error message"
          required
          onInput={(evt) => message.value = evt.currentTarget.value}
        />
      </label>
      <textarea
        class="textarea input-sm w-full"
        name="valueStack"
        value={stack}
        placeholder="Error stack"
        onInput={(evt) => stack.value = evt.currentTarget.value}
      />
      {cause.value !== undefined
        ? (
          <ElementEditor
            value={cause.value}
            onChange={(newCause) => cause.value = newCause}
            onDelete={() => cause.value = undefined}
          />
        )
        : (
          <button
            type="button"
            class="btn btn-sm btn-block"
            onClick={() => cause.value = ""}
          >
            <span class="iconify lucide--plus"></span> Add Cause
          </button>
        )}
    </div>
  );
}
