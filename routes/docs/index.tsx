import { AppFrame } from "$components/AppFrame.tsx";
import { Markdown } from "$components/Markdown.tsx";
import { join } from "$std/path/join.ts";
import { BreadcrumbItem } from "$components/Breadcrumbs.tsx";

export default async function DocsIndex() {
  const content = await Deno.readTextFile(join(Deno.cwd(), "docs", "index.md"));
  const breadcrumbs: BreadcrumbItem[] = [
    { href: "/docs", text: "Docs" },
  ];
  return (
    <AppFrame breadcrumbs={breadcrumbs}>
      <Markdown class="col-span-3 mx-6">{content}</Markdown>
    </AppFrame>
  );
}
