import { assertEquals } from "$std/assert/assert_equals.ts";
import { assertRejects } from "$std/assert/assert_rejects.ts";
import { assert } from "$std/assert/assert.ts";

import { NdJsonStream } from "./ndjson_stream.ts";

Deno.test({
  name: "NdJsonStream - single chunk",
  async fn() {
    const blob = new Blob([`{"a":"b"}\n{"a":"c"}\n`]);
    const stream = blob.stream().pipeThrough(new NdJsonStream<{ a: string }>());
    const actual: { a: string }[] = [];
    for await (const chunk of stream) {
      actual.push(chunk);
    }
    assertEquals(actual, [{ a: "b" }, { a: "c" }]);
  },
});

Deno.test({
  name: "NdJsonStream - multiple chunks",
  async fn() {
    const blob = new Blob([`{"a":"b"}\n`, `{"a":"c"}\n`, `{"a":"d"}\n`]);
    const stream = blob.stream().pipeThrough(new NdJsonStream<{ a: string }>());
    const actual: { a: string }[] = [];
    for await (const chunk of stream) {
      actual.push(chunk);
    }
    assertEquals(actual, [{ a: "b" }, { a: "c" }, { a: "d" }]);
  },
});

Deno.test({
  name: "NdJsonStream - record split across chunks",
  async fn() {
    const blob = new Blob([`{"a":"b"}\n{"a":`, `"c"}\n`, `{"a":"d"}\n`]);
    const stream = blob.stream().pipeThrough(new NdJsonStream<{ a: string }>());
    const actual: { a: string }[] = [];
    for await (const chunk of stream) {
      actual.push(chunk);
    }
    assertEquals(actual, [{ a: "b" }, { a: "c" }, { a: "d" }]);
  },
});

Deno.test({
  name: "NdJsonStream - incomplete record",
  async fn() {
    const blob = new Blob([`{"a":"b"}\n{"a":`, `"c"}\n`, `{"a":"d"}`]);
    const stream = blob.stream().pipeThrough(new NdJsonStream<{ a: string }>());
    const actual: { a: string }[] = [];
    const error = await assertRejects(async () => {
      for await (const chunk of stream) {
        actual.push(chunk);
      }
    });
    assert(error instanceof TypeError);
    assertEquals(
      error.message,
      "The stream was flushed with an incomplete record.",
    );
  },
});

Deno.test({
  name: "NdJsonStream - invalid JSON",
  async fn() {
    const blob = new Blob([`{ a: "b" }\n`]);
    const stream = blob.stream().pipeThrough(new NdJsonStream<{ a: string }>());
    const actual: { a: string }[] = [];
    const error = await assertRejects(async () => {
      for await (const chunk of stream) {
        actual.push(chunk);
      }
    });
    assert(error instanceof SyntaxError);
  },
});
