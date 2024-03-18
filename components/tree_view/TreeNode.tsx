import { type ComponentChildren } from "preact";
import { Toggle } from "./Toggle.tsx";
import { TreeNodeLabel } from "./TreeNodeLabel.tsx";

export function TreeNode(
  {
    id,
    expanded,
    checked,
    disabled,
    indeterminate,
    leaf,
    depth = 0,
    children,
  }: {
    id: string;
    leaf?: boolean;
    expanded?: boolean;
    checked?: boolean;
    disabled?: boolean;
    indeterminate?: boolean;
    depth?: number;
    onToggle?: (id: string) => void;
    children?: ComponentChildren;
  },
) {
  return (
    <li
      role="treeitem"
      class={depth ? `flex my-1 ml-${depth * 4}` : "flex my-1"}
    >
      <Toggle id={id} leaf={leaf} expanded={expanded} />
      <TreeNodeLabel
        id={id}
        checked={checked}
        disabled={disabled}
        indeterminate={indeterminate}
      >
        {children}
      </TreeNodeLabel>
    </li>
  );
}
