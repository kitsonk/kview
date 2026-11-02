import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";

export default function StoreNameEditor({ id, initialName }: { id: string; initialName?: string }) {
  const name = useSignal<string | undefined>(initialName);
  const editing = useSignal(false);
  const draft = useSignal<string>("");
  const error = useSignal<string | null>(null);
  const submitting = useSignal(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing.value) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing.value]);

  function startEditing() {
    draft.value = name.value ?? "";
    error.value = null;
    editing.value = true;
  }

  function cancelEditing() {
    editing.value = false;
    error.value = null;
    submitting.value = false;
  }

  async function save() {
    submitting.value = true;
    error.value = null;
    const trimmed = draft.value.trim();
    try {
      const res = await fetch("/api/local", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify([id, trimmed]),
      });
      if (!res.ok) {
        error.value = `Failed to rename (${res.status} ${res.statusText})`;
        return;
      }
      name.value = trimmed || undefined;
      editing.value = false;
    } catch (err) {
      error.value = `Network error: ${(err as Error).message}`;
    } finally {
      submitting.value = false;
    }
  }

  if (editing.value) {
    return (
      <div class="text-lg font-medium group flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          class="input input-sm w-64 max-w-full"
          placeholder="Store name"
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
              save();
            } else if (e.key === "Escape") {
              e.preventDefault();
              cancelEditing();
            }
          }}
          disabled={submitting.value}
          aria-label="Store name"
        />
        <button
          type="button"
          class="btn btn-sm btn-primary"
          onClick={save}
          disabled={submitting.value}
        >
          {submitting.value ? <span class="loading loading-spinner loading-xs" /> : "Save"}
        </button>
        <button
          type="button"
          class="btn btn-sm btn-ghost"
          onClick={cancelEditing}
          disabled={submitting.value}
        >
          Cancel
        </button>
        {error.value && <span class="text-error text-sm basis-full">{error.value}</span>}
      </div>
    );
  }

  return (
    <div class="text-lg font-medium group flex">
      <div class={name.value ? "" : "italic"}>
        {name.value ?? "[unnamed]"}
      </div>
      <button
        type="button"
        class="ml-2 opacity-0 group-hover:opacity-60 transition-opacity btn btn-ghost btn-xs btn-circle"
        onClick={startEditing}
        aria-label="Rename store"
      >
        <span class="iconify lucide--pen-line size-4"></span>
      </button>
    </div>
  );
}
