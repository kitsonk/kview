// deno-lint-ignore-file react-no-danger
import { render } from "@deno/gfm";

import "prismjs/components/prism-json.js";
import "prismjs/components/prism-typescript.js";

export function Markdown(
  { children: markdown, baseUrl, class: classCss = "" }: {
    children: string;
    baseUrl?: string;
    class?: string;
  },
) {
  const __html = render(markdown, {
    allowIframes: false,
    baseUrl,
    disableHtmlSanitization: true,
  });
  return (
    <div
      class={`markdown ${classCss}`}
      dangerouslySetInnerHTML={{ __html }}
    >
    </div>
  );
}
