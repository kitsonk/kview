import { render } from "@deno/gfm";

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
