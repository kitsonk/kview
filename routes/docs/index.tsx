import { AppFrame } from "$components/AppFrame.tsx";
import { Markdown } from "$components/Markdown.tsx";
import { join } from "@std/path/join";

export default async function DocsIndex() {
  const content = await Deno.readTextFile(join(Deno.cwd(), "docs", "index.md"));
  return (
    <AppFrame breadcrumbs={[{ href: "/docs", text: "Docs" }]} selected="docs">
      <Markdown class="col-span-3 mx-6">{content}</Markdown>
    </AppFrame>
  );
}
