import { assertEquals } from "@std/assert/assert_equals";

import { Progress, ProgressStream } from "./progress_stream.ts";

Deno.test({
  name: "ProgressStream - provides progress",
  async fn() {
    const blob = new Blob([`{"a":"b"}\n`, `{"a":"c"}\n`, `{"a":"d"}\n`]);
    const events: Progress[] = [];
    const stream = blob.stream().pipeThrough(
      new ProgressStream((progress) => events.push(progress)),
    );
    for await (const _chunk of stream) {
      // intentionally empty
    }
    assertEquals(events, [
      { chunkSize: 10, total: 10 },
      { chunkSize: 10, total: 20 },
      { chunkSize: 10, total: 30 },
      { finished: true, total: 30 },
    ]);
  },
});
