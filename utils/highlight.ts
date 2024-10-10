import { escape } from "@std/html/entities";

const JSON_PARTS_RE =
  /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+]?\d+)?)/g;

export function highlightJson(value: unknown): string {
  const json = typeof value === "string"
    ? value
    : JSON.stringify(value, undefined, 2) || typeof value;
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
          c = /true/.test(match)
            ? "true"
            : /false/.test(match)
            ? "false"
            : /null/.test(match)
            ? "null"
            : c;
        }
        return `<span class="${c}">${match}</span>`;
      })
  }</span>`;
}
