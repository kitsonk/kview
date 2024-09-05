import { assertEquals } from "@std/assert/equals";

import { createTreeState, kvTreeToNodes } from "./tree_state.ts";

Deno.test({
  name: "kvTreeToNodes()",
  fn() {
    const actual = kvTreeToNodes({
      children: [
        {
          part: { type: "string", value: "a" },
          children: [
            { part: { type: "string", value: "c" } },
            {
              part: { type: "string", value: "d" },
              children: [
                { part: { type: "string", value: "e" } },
              ],
            },
          ],
        },
        {
          part: { type: "string", value: "b" },
          children: [
            { part: { type: "string", value: "e" } },
          ],
        },
      ],
    });
    assertEquals(actual.length, 2);
    assertEquals(actual[0].id, "1");
    assertEquals(actual[0].children?.length, 2);
    assertEquals(actual[1].id, "2");
    assertEquals(actual[1].children?.length, 1);
  },
});

Deno.test({
  name: "createTreeState",
  fn() {
    const tree = kvTreeToNodes({
      children: [
        {
          part: { type: "string", value: "a" },
          children: [
            { part: { type: "string", value: "c" } },
            {
              part: { type: "string", value: "d" },
              children: [
                { part: { type: "string", value: "e" } },
              ],
            },
          ],
        },
        {
          part: { type: "string", value: "b" },
          children: [
            { part: { type: "string", value: "e" } },
          ],
        },
      ],
    });
    const state = createTreeState();
    state.tree.value = tree;
    assertEquals(state.selected.value.length, 0);
    assertEquals(state.selectedCount.value, 0);
    assertEquals(state.nodes.value.length, 2);
    tree[0].expanded = true;
    state.tree.value = [...tree];
    assertEquals(state.selected.value.length, 0);
    assertEquals(state.selectedCount.value, 0);
    assertEquals(state.nodes.value.length, 4);
    if (tree[0].children) {
      tree[0].children[0].selected = true;
    }
    state.tree.value = [...tree];
    assertEquals(state.selected.value.length, 1);
    assertEquals(state.selectedCount.value, 1);
    assertEquals(state.nodes.value.length, 4);
    assertEquals(state.nodes.value[0].indeterminate, true);
    assertEquals(state.nodes.value[1].checked, true);
  },
});
