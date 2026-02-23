import type { KvValueJSON } from "@deno/kv-utils";
import { assertEquals } from "@std/assert/equals";

import { stringify } from "./kv_json.ts";

Deno.test("stringify - KvArrayJSON", () => {
  const json = {
    type: "Array",
    value: [
      { type: "number", value: 1 },
      { type: "string", value: "hello" },
      { type: "boolean", value: true },
      { type: "null", value: null },
      { type: "undefined" },
      {
        type: "Map",
        value: [
          [
            { type: "string", value: "key" },
            { type: "number", value: 42 },
          ],
        ],
      },
    ],
  } satisfies KvValueJSON;

  const result = stringify(json);
  assertEquals(result, '[1,"hello",true,null,"{undefined}","Map(1)"]');
});

Deno.test("stringify - KvObjectJSON", () => {
  const json = {
    type: "object",
    value: {
      a: { type: "number", value: 1 },
      b: { type: "string", value: "hello" },
      c: { type: "boolean", value: true },
      d: { type: "null", value: null },
      e: { type: "undefined" },
      f: {
        type: "Map",
        value: [
          [
            { type: "string", value: "key" },
            { type: "number", value: 42 },
          ],
        ],
      },
    },
  } satisfies KvValueJSON;

  const result = stringify(json);
  assertEquals(result, '{"a":1,"b":"hello","c":true,"d":null,"e":"{undefined}","f":"Map(1)"}');
});
