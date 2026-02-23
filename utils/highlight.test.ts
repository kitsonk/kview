import type { KvValueJSON } from "@deno/kv-utils";
import { assertEquals } from "@std/assert/equals";

import { format, highlightJSON } from "./highlight.ts";

Deno.test("format - number", () => {
  assertEquals(format("42"), "42");
});

Deno.test("format - string", () => {
  assertEquals(format('"hello"'), '"hello"');
});

Deno.test("format - boolean true", () => {
  assertEquals(format("true"), "true");
});

Deno.test("format - boolean false", () => {
  assertEquals(format("false"), "false");
});

Deno.test("format - null", () => {
  assertEquals(format("null"), "null");
});

Deno.test("format - compact object becomes indented", () => {
  assertEquals(format('{"a":1}'), '{\n  "a": 1\n}');
});

Deno.test("format - compact array becomes indented", () => {
  assertEquals(format("[1,2,3]"), "[\n  1,\n  2,\n  3\n]");
});

Deno.test("highlightJSON - number string", () => {
  assertEquals(
    highlightJSON("42"),
    '<span class="json"><span class="number">42</span></span>',
  );
});

Deno.test("highlightJSON - negative number string", () => {
  assertEquals(
    highlightJSON("-7"),
    '<span class="json"><span class="number">-7</span></span>',
  );
});

Deno.test("highlightJSON - float string", () => {
  assertEquals(
    highlightJSON("3.14"),
    '<span class="json"><span class="number">3.14</span></span>',
  );
});

Deno.test("highlightJSON - boolean true string", () => {
  assertEquals(
    highlightJSON("true"),
    '<span class="json"><span class="boolean">true</span></span>',
  );
});

Deno.test("highlightJSON - boolean false string", () => {
  assertEquals(
    highlightJSON("false"),
    '<span class="json"><span class="boolean">false</span></span>',
  );
});

Deno.test("highlightJSON - null string", () => {
  assertEquals(
    highlightJSON("null"),
    '<span class="json"><span class="null">null</span></span>',
  );
});

Deno.test("highlightJSON - string value", () => {
  assertEquals(
    highlightJSON('"hello"'),
    '<span class="json"><span class="string">"hello"</span></span>',
  );
});

Deno.test("highlightJSON - string value with HTML characters is escaped", () => {
  assertEquals(
    highlightJSON('"<b>hello</b>"'),
    '<span class="json"><span class="string">"&lt;b&gt;hello&lt;/b&gt;"</span></span>',
  );
});

Deno.test("highlightJSON - string value with ampersand is escaped", () => {
  assertEquals(
    highlightJSON('"a & b"'),
    '<span class="json"><span class="string">"a &amp; b"</span></span>',
  );
});

Deno.test("highlightJSON - object with number value", () => {
  assertEquals(
    highlightJSON('{"a":1}'),
    '<span class="json">{<span class="key">"a":</span><span class="number">1</span>}</span>',
  );
});

Deno.test("highlightJSON - object with string value", () => {
  assertEquals(
    highlightJSON('{"name":"world"}'),
    '<span class="json">{<span class="key">"name":</span><span class="string">"world"</span>}</span>',
  );
});

Deno.test("highlightJSON - object with boolean value", () => {
  assertEquals(
    highlightJSON('{"flag":true}'),
    '<span class="json">{<span class="key">"flag":</span><span class="boolean">true</span>}</span>',
  );
});

Deno.test("highlightJSON - object with null value", () => {
  assertEquals(
    highlightJSON('{"x":null}'),
    '<span class="json">{<span class="key">"x":</span><span class="null">null</span>}</span>',
  );
});

Deno.test("highlightJSON - array of numbers", () => {
  assertEquals(
    highlightJSON("[1,2,3]"),
    '<span class="json">[<span class="number">1</span>,<span class="number">2</span>,<span class="number">3</span>]</span>',
  );
});

Deno.test("highlightJSON - KvValueJSON number", () => {
  const json = { type: "number", value: 42 } satisfies KvValueJSON;
  assertEquals(
    highlightJSON(json),
    '<span class="json"><span class="number">42</span></span>',
  );
});

Deno.test("highlightJSON - KvValueJSON string", () => {
  const json = { type: "string", value: "hello" } satisfies KvValueJSON;
  assertEquals(
    highlightJSON(json),
    '<span class="json"><span class="string">"hello"</span></span>',
  );
});

Deno.test("highlightJSON - KvValueJSON boolean true", () => {
  const json = { type: "boolean", value: true } satisfies KvValueJSON;
  assertEquals(
    highlightJSON(json),
    '<span class="json"><span class="boolean">true</span></span>',
  );
});

Deno.test("highlightJSON - KvValueJSON boolean false", () => {
  const json = { type: "boolean", value: false } satisfies KvValueJSON;
  assertEquals(
    highlightJSON(json),
    '<span class="json"><span class="boolean">false</span></span>',
  );
});

Deno.test("highlightJSON - KvValueJSON null", () => {
  const json = { type: "null", value: null } satisfies KvValueJSON;
  assertEquals(
    highlightJSON(json),
    '<span class="json"><span class="null">null</span></span>',
  );
});

Deno.test("highlightJSON - KvValueJSON object produces formatted output", () => {
  const json = {
    type: "object",
    value: {
      count: { type: "number", value: 1 },
      label: { type: "string", value: "foo" },
    },
  } satisfies KvValueJSON;
  assertEquals(
    highlightJSON(json),
    '<span class="json">{\n  <span class="key">"count":</span> <span class="number">1</span>,\n  <span class="key">"label":</span> <span class="string">"foo"</span>\n}</span>',
  );
});
