import { useContext } from "preact/hooks";
import { TreeState } from "$utils/tree_state.ts";

import { TreeNode } from "./tree_view/TreeNode.tsx";
import { KvKeyPart } from "./KvKeyPart.tsx";

export function TreeView() {
  const { nodes } = useContext(TreeState);

  const children = nodes.value.map(
    (
      {
        id,
        expanded,
        checked,
        indeterminate,
        disabled,
        depth,
        leaf,
        item: { part },
      },
    ) => (
      <TreeNode
        id={id}
        key={id}
        depth={depth}
        leaf={leaf}
        expanded={expanded}
        checked={checked}
        indeterminate={indeterminate}
        disabled={disabled}
      >
        <KvKeyPart part={part} />
      </TreeNode>
    ),
  );

  return <ul role="tree" aria-multiselectable="true">{children}</ul>;
}
