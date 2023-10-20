import { assertEquals } from "$std/assert/assert_equals.ts";
import { keyJsonToPath, keyToJson, pathToKey } from "./kv.ts";

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
  name: "pathToKey - number",
  fn() {
    assertEquals(pathToKey("__n__1000/1abc"), [1000, "1abc"]);
  },
});

Deno.test({
  name: "pathToKey - boolean",
  fn() {
    assertEquals(pathToKey("true/false/True/False"), [
      true,
      false,
      "True",
      "False",
    ]);
  },
});

Deno.test({
  name: "pathToKey - bigint",
  fn() {
    assertEquals(pathToKey("100n/__n__100"), [100n, 100]);
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
  name: "keyJsonToPath - Uint8Array",
  fn() {
    assertEquals(
      keyJsonToPath(keyToJson([new Uint8Array([1, 2, 3])])),
      "__u8__AQID",
    );
  },
});
