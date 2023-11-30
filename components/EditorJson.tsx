import { Editor, type EditorProps } from "./Editor.tsx";
import { highlightJson } from "$utils/highlight.ts";

type EditorJsonProps = Omit<EditorProps, "highlight">;

export function EditorJson(props: EditorJsonProps) {
  return <Editor {...props} highlight={highlightJson} />;
}
