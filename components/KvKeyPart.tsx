import type { KvKeyPartJSON } from "@deno/kv-utils/json";

export function KvKeyPart({ keyPart }: { keyPart: KvKeyPartJSON }) {
  switch (keyPart.type) {
    case "string":
      return <span class="badge badge-primary">{keyPart.value}</span>;
    case "number":
      return <span class="badge badge-secondary">{keyPart.value}</span>;
    case "bigint":
      return <span class="badge badge-info">{keyPart.value}n</span>;
    case "boolean":
      return <span class="badge badge-warning">{keyPart.value ? "true" : "false"}</span>;
    case "Uint8Array":
      return <span class="badge badge-accent">Uint8Array({keyPart.byteLength} bytes)</span>;
    default:
      return <span class="badge badge-neutral italic">unknown</span>;
  }
}
