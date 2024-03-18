import { type Signal, useSignal, useSignalEffect } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";

enum View {
  Label,
  Input,
}

export function EditLabel(
  {
    value,
    id,
    name,
    labelClass,
    inputClass,
    emptyDisplay = "[empty]",
    disableKeys,
  }: {
    value: Signal<string | undefined>;
    id?: string;
    name?: string;
    labelClass?: string;
    inputClass?: string;
    emptyDisplay?: string;
    disableKeys?: boolean;
  },
) {
  const view = useSignal(View.Label);
  const current = useSignal(value.peek());
  const previous = useSignal(value.peek());
  const textInput = useRef<HTMLInputElement>(null);
  let escaped = false;

  useEffect(() => {
    if (view.value === View.Input) {
      textInput.current?.focus();
    }
  });

  useSignalEffect(() => {
    if (view.value === View.Input) {
      escaped = false;
    }
  });

  return view.value === View.Label
    ? (
      <span
        class={value.value ? labelClass : `${labelClass} italic`}
        onClick={() => view.value = View.Input}
      >
        {value.value || emptyDisplay}
      </span>
    )
    : (
      <input
        type="text"
        value={current}
        ref={textInput}
        class={inputClass}
        id={id}
        name={name}
        onInput={(e) => {
          if (!escaped) {
            current.value = e.currentTarget.value;
          }
        }}
        onBlur={() => {
          if (!escaped) {
            view.value = View.Label;
            previous.value = current.value;
            value.value = current.value;
          }
        }}
        onKeyUp={(e) => {
          if (disableKeys) {
            return;
          }

          if (e.key === "Escape") {
            escaped = true;
            current.value = previous.value;
            view.value = View.Label;
          } else if (e.key === "Enter") {
            current.value = e.currentTarget.value;
            previous.value = e.currentTarget.value;
            view.value = View.Label;
            value.value = e.currentTarget.value;
          }
        }}
      />
    );
}
