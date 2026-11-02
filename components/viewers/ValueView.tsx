import type { KvValueJSON } from "@deno/kv-utils/json";

import { PrimitiveViewer } from "./PrimitiveViewer.tsx";
import { ArrayViewer } from "./ArrayViewer.tsx";
import { ObjectViewer } from "./ObjectViewer.tsx";
import { MapViewer } from "./MapViewer.tsx";
import { SetViewer } from "./SetViewer.tsx";

export function ValueView(
  { value, root = false, noBadge = false }: { value: KvValueJSON; root?: boolean; noBadge?: boolean },
) {
  switch (value.type) {
    case "Array":
      return <ArrayViewer value={value} root={root} />;
    case "object":
      return <ObjectViewer value={value} root={root} />;
    case "Map":
      return <MapViewer value={value} root={root} />;
    case "Set":
      return <SetViewer value={value} root={root} />;
    default:
      return <PrimitiveViewer value={value} noBadge={noBadge} />;
  }
}
