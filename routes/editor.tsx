import { AppFrame } from "@/components/AppFrame.tsx";
import Editor from "@/islands/Editor.tsx";
import { define } from "@/utils/fresh.ts";

export default define.page(function EditorPage() {
  return (
    <AppFrame>
      <Editor />
    </AppFrame>
  );
});
