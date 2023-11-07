import { type JSX } from "preact";
import { useSignal, useSignalEffect } from "@preact/signals";
import { useRef } from "preact/hooks";

interface DialogProps extends JSX.HTMLAttributes<HTMLDialogElement> {
  returnValue?: JSX.SignalLike<string>;
}

function isSignalLike<T>(value: unknown): value is JSX.SignalLike<T> {
  return !!(value && typeof value === "object" && "value" in value &&
    "peek" in value && typeof value.peek === "function" &&
    "subscribe" in value &&
    typeof value.subscribe === "function");
}

export function Dialog(
  { children, open, onClose, returnValue, ...props }: DialogProps,
) {
  const ref = useRef<HTMLDialogElement>(null);
  const openSignal = isSignalLike(open) ? open : useSignal(open);

  useSignalEffect(() => {
    if (openSignal.value) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  });

  return (
    <dialog
      ref={ref}
      onClose={(evt) => {
        openSignal.value = false;
        if (returnValue && ref.current) {
          returnValue.value = ref.current.returnValue;
        }
        onClose?.(evt);
      }}
      {...props}
    >
      {children}
    </dialog>
  );
}
