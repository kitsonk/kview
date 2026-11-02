import { useSignal, useSignalEffect } from "@preact/signals";
import type { SignalLike } from "preact";
import { useRef } from "preact/hooks";

interface Props {
  isOpen: SignalLike<boolean>;
  currentName?: string;
  error: SignalLike<string | null>;
  submitting: SignalLike<boolean>;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export function DialogRenameStore({ isOpen, currentName, error, submitting, onClose, onSubmit }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const draft = useSignal<string>(currentName ?? "");

  useSignalEffect(() => {
    if (isOpen.value) {
      draft.value = currentName ?? "";
      ref.current?.showModal();
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      ref.current?.close();
    }
  });

  return (
    <dialog ref={ref} class="modal">
      <div class="modal-box">
        <form method="dialog">
          <button
            type="submit"
            onClick={onClose}
            class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            aria-label="Close"
          >
            ✕
          </button>
        </form>
        <h3 class="text-lg font-bold mb-4">Rename store</h3>
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Name</legend>
          <input
            ref={inputRef}
            type="text"
            class="input w-full"
            placeholder="My store"
            value={draft.value}
            onInput={(e) => {
              draft.value = (e.currentTarget as HTMLInputElement).value;
              if (error.value) {
                error.value = null;
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSubmit(draft.value);
              }
            }}
            disabled={submitting.value}
          />
          <p class="fieldset-label">Leave blank to remove the name.</p>
          {error.value && <p class="text-error text-sm mt-1">{error.value}</p>}
        </fieldset>
        <div class="modal-action">
          <button type="button" class="btn btn-ghost" onClick={onClose} disabled={submitting.value}>
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-primary"
            disabled={submitting.value}
            onClick={() => onSubmit(draft.value)}
          >
            {submitting.value ? <span class="loading loading-spinner loading-xs" /> : "Save"}
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button type="submit" onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
