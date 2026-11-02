import { type BlobOrValueEntryJSON, isBlobEntryJSON } from "@/utils/blobs.ts";
import { ValueView } from "@/components/viewers/ValueView.tsx";

import { ValueBlob } from "./values/Blob.tsx";

export function KvValue(
  { entry, storeId, noBadge = false }: { entry: BlobOrValueEntryJSON; storeId?: string; noBadge?: boolean },
) {
  if (entry.value) {
    return <ValueView value={entry.value} root noBadge={noBadge} />;
  }
  if (isBlobEntryJSON(entry) && storeId) {
    return <ValueBlob entry={entry} storeId={storeId} />;
  }
}
