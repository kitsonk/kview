import { KvValueJSON } from "@deno/kv-utils";
import { escape } from "@std/html/entities";

import { stringify } from "./kv_json.ts";

const JSON_PARTS_RE =
  /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+]?\d+)?)/g;

export function format(value: string): string {
  return JSON.stringify(JSON.parse(value), null, 2);
}

export function highlightJSON(value: string | KvValueJSON): string {
  const json = typeof value === "string" ? value : format(stringify(value));
  return `<span class="json">${
    json
      .replace(/&/g, "&")
      .replace(/</g, "<")
      .replace(/>/g, ">")
      .replace(JSON_PARTS_RE, (match) => {
        let c = "number";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            c = "key";
          } else {
            c = "string";
            match = `"${escape(match.substring(1, match.length - 1))}"`;
          }
        } else {
          c = /true/.test(match) ? "boolean" : /false/.test(match) ? "boolean" : /null/.test(match) ? "null" : c;
        }
        return `<span class="${c}">${match}</span>`;
      })
  }</span>`;
}
