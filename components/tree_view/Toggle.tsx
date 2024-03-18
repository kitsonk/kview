import { useContext } from "preact/hooks";
import { toggleExpanded, TreeState } from "$utils/tree_state.ts";

import IconExpandDownArrow from "../icons/ExpandDownArrow.tsx";
import IconExpandRightArrow from "../icons/ExpandRightArrow.tsx";

export function Toggle(
  { id, leaf, expanded }: {
    id: string;
    leaf?: boolean;
    expanded?: boolean;
  },
) {
  const { tree } = useContext(TreeState);

  return (
    <div
      role="button"
      tabIndex={-1}
      class={leaf ? "invisible" : "dark:text-white"}
      onClick={() => toggleExpanded(tree, id)}
      aria-hidden
    >
      {expanded
        ? <IconExpandDownArrow size={7} />
        : <IconExpandRightArrow size={7} />}
    </div>
  );
}
