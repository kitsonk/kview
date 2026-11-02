import type { BlobMeta } from "@kitsonk/kv-toolbox/blob";
import type { Signal } from "@preact/signals";

export function BlobValueEditor(
  { meta: _meta, onChange }: { meta: Signal<BlobMeta | undefined>; onChange?: (file: File) => void },
) {
  return (
    <input
      type="file"
      class="file-input w-full"
      onChange={(evt) => {
        if (onChange && evt.currentTarget.files) {
          const [file] = evt.currentTarget.files;
          if (file) {
            onChange(file);
          }
        }
      }}
    />
  );
}
