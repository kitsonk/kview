import { assertEquals } from "@std/assert";

import { isBlobEntryJSON, isBlobMeta, isEntryJSON } from "./blobs.ts";

const regularValueEntry = {
  key: ["foo"],
  value: { type: "string", value: "hello" },
  versionstamp: "abc",
};

const noValueEntry = {
  key: ["foo"],
  value: null,
  versionstamp: null,
};

const blobEntry = {
  key: ["foo"],
  value: undefined,
  meta: { kind: "blob", type: "application/octet-stream", size: 10 },
  versionstamp: "abc",
};

Deno.test("isBlobEntryJSON - returns true for a blob entry with meta", () => {
  assertEquals(isBlobEntryJSON(blobEntry as unknown as Parameters<typeof isBlobEntryJSON>[0]), true);
});

Deno.test("isBlobEntryJSON - returns false for a regular value entry (meta undefined)", () => {
  assertEquals(isBlobEntryJSON(regularValueEntry as unknown as Parameters<typeof isBlobEntryJSON>[0]), false);
});

Deno.test("isBlobEntryJSON - returns false for a no-value entry (meta undefined)", () => {
  assertEquals(isBlobEntryJSON(noValueEntry as unknown as Parameters<typeof isBlobEntryJSON>[0]), false);
});

Deno.test("isBlobEntryJSON - returns false when meta is explicitly null", () => {
  const entry = { ...regularValueEntry, meta: null };
  assertEquals(isBlobEntryJSON(entry as unknown as Parameters<typeof isBlobEntryJSON>[0]), false);
});

Deno.test("isEntryJSON - returns true for a regular value entry with versionstamp", () => {
  assertEquals(isEntryJSON(regularValueEntry as unknown as Parameters<typeof isEntryJSON>[0]), true);
});

Deno.test("isEntryJSON - returns false for a no-value entry with null versionstamp", () => {
  assertEquals(isEntryJSON(noValueEntry as unknown as Parameters<typeof isEntryJSON>[0]), false);
});

Deno.test("isEntryJSON - returns true for a blob entry with versionstamp", () => {
  assertEquals(isEntryJSON(blobEntry as unknown as Parameters<typeof isEntryJSON>[0]), true);
});

Deno.test("isBlobMeta - returns true for a blob meta with kind", () => {
  assertEquals(isBlobMeta({ kind: "blob", type: "application/octet-stream", size: 10 }), true);
  assertEquals(isBlobMeta({ kind: "file" }), true);
});

Deno.test("isBlobMeta - returns false for a regular value JSON", () => {
  assertEquals(isBlobMeta({ type: "string", value: "hello" }), false);
  assertEquals(isBlobMeta(null), false);
  assertEquals(isBlobMeta(undefined), false);
  assertEquals(isBlobMeta("blob"), false);
});
