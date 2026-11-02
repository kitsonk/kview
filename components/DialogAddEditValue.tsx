import type { KvValueJSON } from "@deno/kv-utils/json";
import type { BlobMeta } from "@kitsonk/kv-toolbox/blob";
import { batch, useSignal, useSignalEffect } from "@preact/signals";
import type { SignalLike } from "preact";
import { useRef } from "preact/hooks";

import { getKvValueType, KvValueEditor, type KvValueTypes } from "./KvValueEditor.tsx";

interface Props {
  isOpen: SignalLike<boolean>;
  onClose: () => void;
  value: SignalLike<KvValueJSON | BlobMeta | undefined>;
  error?: SignalLike<string | null>;
  submitting?: SignalLike<boolean>;
  onSubmit: (
    type: KvValueTypes,
    value: KvValueJSON | undefined,
    file: File | undefined,
  ) => void;
}

export function DialogAddEditValue(
  { isOpen, onClose, value, error, submitting, onSubmit }: Props,
) {
  const ref = useRef<HTMLDialogElement>(null);
  const currentType = useSignal<KvValueTypes | undefined>(undefined);
  const currentValue = useSignal<KvValueJSON | undefined>(undefined);
  const currentFile = useSignal<File | undefined>(undefined);

  useSignalEffect(() => {
    if (isOpen.value) {
      const v = value.value;
      batch(() => {
        currentType.value = v ? getKvValueType(v) : "string";
        currentValue.value = v && !("kind" in v) ? v : undefined;
        currentFile.value = undefined;
      });
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  });

  const isEditing = value.value !== undefined;
  const heading = isEditing ? "Update Value" : "Add Value";
  const actionLabel = isEditing ? "Update" : "Add";
  const isSubmitting = submitting?.value ?? false;
  const errorMessage = error?.value ?? null;

  return (
    <dialog ref={ref} class="modal">
      <div class="modal-box">
        <form method="dialog">
          <button type="submit" onClick={onClose} class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 class="text-lg font-bold mb-4">{heading}</h3>
        {isOpen.value && (
          <KvValueEditor
            value={value.value}
            onChange={(type, value, file) => {
              batch(() => {
                currentType.value = type;
                currentValue.value = value;
                currentFile.value = file;
              });
            }}
          />
        )}
        {errorMessage && <p class="text-error text-sm mt-2">{errorMessage}</p>}
        <div class="modal-action">
          <button type="button" class="btn btn-ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-primary"
            disabled={isSubmitting}
            onClick={() => {
              onSubmit(
                currentType.value ?? "string",
                currentValue.value,
                currentFile.value,
              );
            }}
          >
            {isSubmitting ? <span class="loading loading-spinner loading-xs" /> : actionLabel}
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button type="submit" onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
