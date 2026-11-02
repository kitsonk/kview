import { assertEquals } from "@std/assert/equals";

import { pathToKey, setLocalStoreName } from "./kv.ts";

Deno.test({
  name: "pathToKey - single string",
  fn() {
    assertEquals(pathToKey("foo"), ["foo"]);
  },
});

Deno.test({
  name: "pathToKey - two strings",
  fn() {
    assertEquals(pathToKey("foo/bar"), ["foo", "bar"]);
  },
});

Deno.test({
  name: "pathToKey - strings with slashes",
  fn() {
    assertEquals(pathToKey("foo/%2Fbar"), ["foo", "/bar"]);
  },
});

Deno.test({
  name: "pathToKey - single char strings",
  fn() {
    assertEquals(
      pathToKey("index/2023/1/__n__4"),
      ["index", "2023", "1", 4],
    );
  },
});

Deno.test({
  name: "pathToKey - number",
  fn() {
    assertEquals(pathToKey("__n__1000/1abc"), [1000, "1abc"]);
  },
});

Deno.test({
  name: "pathToKey - boolean",
  fn() {
    assertEquals(pathToKey("__true__/__false__/true/false/True/False"), [
      true,
      false,
      "true",
      "false",
      "True",
      "False",
    ]);
  },
});

Deno.test({
  name: "pathToKey - bigint",
  fn() {
    assertEquals(pathToKey("__b__100/__n__100"), [100n, 100]);
  },
});

Deno.test({
  name: "pathToKey - issue #8",
  fn() {
    assertEquals(pathToKey("user_2b8oavU3nky3ec2MeMO82vMlwm"), [
      "user_2b8oavU3nky3ec2MeMO82vMlwm",
    ]);
  },
});

Deno.test({
  name: "pathToKey - Uint8Array",
  fn() {
    assertEquals(pathToKey("__u8__AQID/foo"), [
      new Uint8Array([1, 2, 3]),
      "foo",
    ]);
  },
});

Deno.test({
  name: "setLocalStoreName - stores non-empty name",
  fn() {
    localStorage.clear();
    setLocalStoreName("store-a", "My Store");
    const raw = localStorage.getItem("kview_local_store_names");
    assertEquals(raw, JSON.stringify({ "store-a": "My Store" }));
  },
});

Deno.test({
  name: "setLocalStoreName - trims surrounding whitespace",
  fn() {
    localStorage.clear();
    setLocalStoreName("store-a", "  Padded  ");
    const raw = localStorage.getItem("kview_local_store_names");
    assertEquals(raw, JSON.stringify({ "store-a": "Padded" }));
  },
});

Deno.test({
  name: "setLocalStoreName - empty string deletes the key",
  fn() {
    localStorage.clear();
    setLocalStoreName("store-a", "Initial");
    setLocalStoreName("store-a", "");
    const raw = localStorage.getItem("kview_local_store_names");
    assertEquals(raw, "{}");
  },
});

Deno.test({
  name: "setLocalStoreName - whitespace-only string deletes the key",
  fn() {
    localStorage.clear();
    setLocalStoreName("store-a", "Initial");
    setLocalStoreName("store-a", "   \t  ");
    const raw = localStorage.getItem("kview_local_store_names");
    assertEquals(raw, "{}");
  },
});

Deno.test({
  name: "setLocalStoreName - delete only affects the targeted id",
  fn() {
    localStorage.clear();
    setLocalStoreName("store-a", "A");
    setLocalStoreName("store-b", "B");
    setLocalStoreName("store-a", "");
    const raw = localStorage.getItem("kview_local_store_names");
    assertEquals(raw, JSON.stringify({ "store-b": "B" }));
  },
});
