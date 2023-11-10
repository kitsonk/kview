import { assertEquals } from "$std/assert/assert_equals.ts";
import { keyJsonToPath, keyToJson, pathToKey, toValue } from "./kv.ts";

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

Deno.test({
  name: "toValue - string",
  fn() {
    assertEquals(toValue({ type: "string", value: "foo" }), "foo");
  },
});

Deno.test({
  name: "toValue - number",
  fn() {
    assertEquals(toValue({ type: "number", value: 1234 }), 1234);
  },
});

Deno.test({
  name: "toValue - bigint",
  fn() {
    assertEquals(toValue({ type: "bigint", value: "12345" }), 12345n);
  },
});

Deno.test({
  name: "toValue - boolean",
  fn() {
    assertEquals(toValue({ type: "boolean", value: true }), true);
  },
});

Deno.test({
  name: "toValue - Uint8Array",
  fn() {
    assertEquals(
      toValue({ type: "Uint8Array", value: "AQID" }),
      new Uint8Array([1, 2, 3]),
    );
  },
});

Deno.test({
  name: "toValue - null",
  fn() {
    assertEquals(toValue({ type: "null", value: null }), null);
  },
});

Deno.test({
  name: "toValue - Map",
  fn() {
    assertEquals(
      toValue({ type: "Map", value: [["key", "value"]] }),
      new Map([["key", "value"]]),
    );
  },
});

Deno.test({
  name: "toValue - Set",
  fn() {
    assertEquals(
      toValue({ type: "Set", value: ["a", "b", "c"] }),
      new Set(["a", "b", "c"]),
    );
  },
});

Deno.test({
  name: "toValue - RegExp",
  fn() {
    assertEquals(
      (toValue({ type: "RegExp", value: "/abc/i" }) as RegExp).toString(),
      "/abc/i",
    );
  },
});

Deno.test({
  name: "toValue - Array",
  fn() {
    assertEquals(
      toValue({ type: "object", value: ["a", "b", "c"] }),
      ["a", "b", "c"],
    );
  },
});

Deno.test({
  name: "toValue - object",
  fn() {
    assertEquals(
      toValue({ type: "object", value: { a: "string" } }),
      { a: "string" },
    );
  },
});
