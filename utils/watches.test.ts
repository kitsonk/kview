import { assertEquals } from "$std/assert/assert_equals.ts";

import { addWatch, deleteWatch } from "./watches.ts";

Deno.test({
  name: "addWatch - add new key",
  fn() {
    const actual = addWatch("abcdefg", {
      key: [{ type: "string", value: "a" }],
    }, {
      a1234: { keys: [["a"]] },
    });
    assertEquals(actual, {
      a1234: { keys: [["a"]] },
      abcdefg: { keys: [["a"]], name: undefined, href: undefined },
    });
  },
});

Deno.test({
  name: "addWatch - push existing key",
  fn() {
    const actual = addWatch("abcdefg", {
      key: [{ type: "string", value: "b" }],
    }, {
      abcdefg: { keys: [["a"]] },
    });
    assertEquals(actual, {
      abcdefg: { keys: [["a"], ["b"]], href: undefined, name: undefined },
    });
  },
});

Deno.test({
  name: "addWatch - already existing",
  fn() {
    const actual = addWatch("abcdefg", {
      key: [{ type: "string", value: "a" }],
    }, {
      abcdefg: { keys: [["a"]] },
    });
    assertEquals(actual, {
      abcdefg: { keys: [["a"]], name: undefined, href: undefined },
    });
  },
});

Deno.test({
  name: "deleteWatch",
  fn() {
    const actual = deleteWatch("abcdefg", [{ type: "string", value: "b" }], {
      abcdefg: { keys: [["a"], ["b", "c"], ["b"], ["d"]] },
    });
    assertEquals(actual, {
      abcdefg: { keys: [["a"], ["b", "c"], ["d"]] },
    });
  },
});

Deno.test({
  name: "deleteWatch - non existent element",
  fn() {
    const actual = deleteWatch("abcdef", [{ type: "string", value: "b" }], {
      abcdefg: { keys: [["a"]] },
    });
    assertEquals(actual, {
      abcdefg: { keys: [["a"]] },
    });
  },
});

Deno.test({
  name: "deleteWatch - non existent key",
  fn() {
    const actual = deleteWatch("a1234", [{ type: "string", value: "b" }], {
      abcdefg: { keys: [["a"]] },
    });
    assertEquals(actual, {
      abcdefg: { keys: [["a"]] },
    });
  },
});
