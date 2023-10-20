import { AppFrame } from "$components/AppFrame.tsx";
import { Markdown } from "$components/Markdown.tsx";

export default async function DocsIndex() {
  const content = await Deno.readTextFile(
    new URL("../../docs/index.md", import.meta.url),
  );
  return (
    <AppFrame>
      <Markdown class="col-span-3 mx-6">{content}</Markdown>
    </AppFrame>
  );
}
