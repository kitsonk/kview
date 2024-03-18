import { type ComponentChildren } from "preact";

import { Checkbox } from "./Checkbox.tsx";

export function TreeNodeLabel(
  { id, title, checked, disabled, indeterminate, readonly, children }: {
    id: string;
    title?: string;
    checked?: boolean;
    disabled?: boolean;
    indeterminate?: boolean;
    readonly?: boolean;
    children?: ComponentChildren;
  },
) {
  return (
    <label title={title} for={id}>
      <Checkbox
        id={id}
        checked={checked}
        disabled={disabled}
        indeterminate={indeterminate}
        readonly={readonly}
        name={id}
      />
      <span>{children}</span>
    </label>
  );
}
