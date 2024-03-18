import { useContext, useEffect, useRef } from "preact/hooks";
import { setSelected, TreeState } from "$utils/tree_state.ts";

export function Checkbox(
  { id, checked, disabled, name, indeterminate, readonly }: {
    id: string;
    checked?: boolean;
    disabled?: boolean;
    name: string;
    indeterminate?: boolean;
    readonly?: boolean;
  },
) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate ?? false;
    }
  });

  const { tree } = useContext(TreeState);

  return (
    <input
      name={name}
      ref={ref}
      type="checkbox"
      checked={checked}
      disabled={disabled}
      readonly={readonly}
      onChange={(evt) => {
        const { currentTarget: { checked } } = evt;
        setSelected(tree, id, checked);
        evt.stopPropagation();
      }}
      class="mx-1 align-middle"
    />
  );
}
