import { assertEquals } from "@std/assert/equals";

import { formDataToKvValueJSON } from "./formData.ts";

Deno.test({
  name: "formDataToKvValueJSON - object",
  async fn() {
    const type = "object";
    const value = JSON.stringify({ a: 1, b: 2 });
    assertEquals(await formDataToKvValueJSON(type, value, null), {
      type,
      value: {
        a: { type: "number", value: 1 },
        b: { type: "number", value: 2 },
      },
    });
  },
});

Deno.test({
  name: "formDataToKvValueJSON - array",
  async fn() {
    const type = "Array";
    const value = JSON.stringify([1, 2]);
    assertEquals(await formDataToKvValueJSON(type, value, null), {
      type,
      value: [
        { type: "number", value: 1 },
        { type: "number", value: 2 },
      ],
    });
  },
});

Deno.test({
  name: "formDataToKvValueJSON - set",
  async fn() {
    const type = "Set";
    const value = JSON.stringify([1, 2]);
    assertEquals(await formDataToKvValueJSON(type, value, null), {
      type,
      value: [
        { type: "number", value: 1 },
        { type: "number", value: 2 },
      ],
    });
  },
});

Deno.test({
  name: "formDataToKvValueJSON - map",
  async fn() {
    const type = "Map";
    const value = JSON.stringify([["a", 1], ["b", 2]]);
    assertEquals(await formDataToKvValueJSON(type, value, null), {
      type,
      value: [
        [{ type: "string", value: "a" }, { type: "number", value: 1 }],
        [{ type: "string", value: "b" }, { type: "number", value: 2 }],
      ],
    });
  },
});
