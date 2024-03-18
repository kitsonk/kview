import { type JSX } from "preact";
import { useSignalEffect } from "@preact/signals";
import { useRef } from "preact/hooks";
import { asSignal } from "$utils/signals.ts";

interface DialogProps extends JSX.HTMLAttributes<HTMLDialogElement> {
  returnValue?: JSX.SignalLike<string>;
}

export function Dialog(
  { children, open, onClose, returnValue, ...props }: DialogProps,
) {
  const ref = useRef<HTMLDialogElement>(null);
  const openSignal = asSignal(open);

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
