import { keyToJSON } from "@deno/kv-utils/json";
import { assertEquals } from "@std/assert/equals";

import { isEditable, keyJsonToPath, pathToKey } from "./kv.ts";

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

Deno.test({
  name: "isEditable - string",
  fn() {
    assertEquals(isEditable({ type: "string", value: "string" }), true);
  },
});

Deno.test({
  name: "isEditable - object - true",
  fn() {
    assertEquals(
      isEditable({
        type: "object",
        value: {
          "a": {
            type: "object",
            value: { "b": { type: "string", value: "string" } },
          },
        },
      }),
      true,
    );
  },
});

Deno.test({
  name: "isEditable - object - false",
  fn() {
    assertEquals(
      isEditable({
        type: "object",
        value: { "a": { type: "bigint", value: "100" } },
      }),
      false,
    );
  },
});

Deno.test({
  name: "isEditable - array - true",
  fn() {
    assertEquals(
      isEditable({
        type: "Array",
        value: [
          { type: "string", value: "string" },
          {
            type: "object",
            value: { "b": { type: "string", value: "string" } },
          },
        ],
      }),
      true,
    );
  },
});

Deno.test({
  name: "isEditable - array - false",
  fn() {
    assertEquals(
      isEditable({
        type: "Array",
        value: [
          { type: "bigint", value: "100" },
          {
            type: "object",
            value: { "b": { type: "string", value: "string" } },
          },
        ],
      }),
      false,
    );
  },
});

Deno.test({
  name: "isEditable - map - true",
  fn() {
    assertEquals(
      isEditable({
        type: "Map",
        value: [
          [
            {
              type: "object",
              value: { a: { type: "string", value: "string" } },
            },
            { type: "string", value: "string" },
          ],
        ],
      }),
      true,
    );
  },
});

Deno.test({
  name: "isEditable - map - false",
  fn() {
    assertEquals(
      isEditable({
        type: "Map",
        value: [
          [{
            type: "object",
            value: { a: { type: "string", value: "string" } },
          }, {
            type: "object",
            value: { b: { type: "RegExp", value: "/1234/i" } },
          }],
        ],
      }),
      false,
    );
  },
});

Deno.test({
  name: "isEditable - set - true",
  fn() {
    assertEquals(
      isEditable({
        type: "Set",
        value: [{ type: "string", value: "string" }],
      }),
      true,
    );
  },
});

Deno.test({
  name: "isEditable - set - false",
  fn() {
    assertEquals(
      isEditable({
        type: "Set",
        value: [{ type: "string", value: "string" }, {
          type: "Date",
          value: "2021-01-01",
        }],
      }),
      false,
    );
  },
});
