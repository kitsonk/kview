import { useSignal } from "@preact/signals";

import { DialogRenameStore } from "@/components/DialogRenameStore.tsx";

export default function CardStoreMenu({ id, initialName }: { id: string; initialName?: string }) {
  const name = useSignal<string | undefined>(initialName);
  const dialogOpen = useSignal(false);
  const error = useSignal<string | null>(null);
  const submitting = useSignal(false);

  async function handleSubmit(newName: string) {
    submitting.value = true;
    error.value = null;
    const trimmed = newName.trim();
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
      dialogOpen.value = false;
    } catch (err) {
      error.value = `Network error: ${(err as Error).message}`;
    } finally {
      submitting.value = false;
    }
  }

  return (
    <>
      <span class="text-sm font-medium">
        <a href={`/local/${id}`} class="underline-offset-4 hover:underline">
          {name.value ?? <span class="text-base-content/80 italic">[unnamed]</span>}
        </a>
      </span>
      <div class="ms-auto">
        <div class="dropdown dropdown-bottom dropdown-center">
          <div
            tabindex={0}
            role="button"
            class="btn btn-ghost btn-circle btn-sm"
            aria-label="Menu"
          >
            <span class="iconify lucide--more-vertical size-4"></span>
          </div>
          <ul
            tabindex={0}
            class="dropdown-content bg-base-100 rounded-box mt-2 w-52 shadow menu p-1.5"
          >
            <li>
              <button
                type="button"
                onClick={() => {
                  error.value = null;
                  dialogOpen.value = true;
                }}
              >
                <span class="iconify lucide--pen-line size-4"></span>
                Rename
              </button>
            </li>
          </ul>
        </div>
      </div>
      <DialogRenameStore
        isOpen={dialogOpen}
        currentName={name.value}
        error={error}
        submitting={submitting}
        onClose={() => (dialogOpen.value = false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
