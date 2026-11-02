import { keyToJSON } from "@deno/kv-utils/json";
import { assertEquals } from "@std/assert/equals";

import { keyJsonToPath } from "@/utils/kv_path.ts";

Deno.test({
  name: "keyJsonToPath - Uint8Array",
  fn() {
    assertEquals(
      keyJsonToPath(keyToJSON([new Uint8Array([1, 2, 3])])),
      "__u8__AQID",
    );
  },
});

Deno.test({
  name: "keyJsonToPath - string with slashes",
  fn() {
    assertEquals(
      keyJsonToPath(keyToJSON(["foo", "/bar"])),
      "foo/%2Fbar",
    );
  },
});

Deno.test({
  name: "keyJsonToPath - single digit strings",
  fn() {
    assertEquals(
      keyJsonToPath(keyToJSON(["index", "2023", "1", 4])),
      "index/2023/1/__n__4",
    );
  },
});
