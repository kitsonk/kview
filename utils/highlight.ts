import { escape } from "@std/html/entities";
import { apply, tw } from "twind";

const classes = {
  key: apply`text-primary(700 dark:300)`,
  number: apply`text-purple(700 dark:300)`,
  string: apply`whitespace-pre-wrap break-words text-blue(700 dark:300)`,
  true: apply`text-yellow(700 dark:300)`,
  false: apply`text-yellow(700 dark:300)`,
  null: apply`text-gray(600 dark:400)`,
} as const;

const JSON_PARTS_RE =
  /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+]?\d+)?)/g;

export function highlightJson(value: unknown): string {
  const json = typeof value === "string"
    ? value
    : JSON.stringify(value, undefined, 2) || typeof value;
  return json
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(JSON_PARTS_RE, (match) => {
      let c = classes.number;
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          c = classes.key;
        } else {
          c = classes.string;
          match = `"${escape(match.substring(1, match.length - 1))}"`;
        }
      } else {
        c = /true/.test(match)
          ? classes.true
          : /false/.test(match)
          ? classes.false
          : /null/.test(match)
          ? classes.null
          : c;
      }
      return `<span class="${tw`${c}`}">${match}</span>`;
    });
}
