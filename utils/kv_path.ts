import type { KvKeyJSON } from "@deno/kv-utils/json";

export function keyJsonToPath(key: KvKeyJSON): string {
  return key.map((keyPart) => {
    switch (keyPart.type) {
      case "Uint8Array":
        return `__u8__${keyPart.value}`;
      case "bigint":
        return `__b__${keyPart.value}`;
      case "boolean":
        return keyPart.value ? "__true__" : "__false__";
      case "number":
        return `__n__${keyPart.value}`;
      case "string":
        if (keyPart.value === "") {
          return "__empty_string__";
        }
        return encodeURIComponent(keyPart.value);
    }
  }).join("/");
}
