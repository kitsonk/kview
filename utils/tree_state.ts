import { createContext } from "preact";
import { computed, type Signal, signal } from "@preact/signals";

import { type KvKeyTreeJSON, type KvKeyTreeNodeJSON } from "./kv.ts";
import { KvKeyJSON } from "kv-toolbox/json";

export interface TreeNode<Item> {
  id: string;
  depth: number;
  checked: boolean;
  expanded: boolean;
  indeterminate: boolean;
  disabled: boolean;
  leaf: boolean;
  item: Item;
}

interface NodeState<Item> {
  id: string;
  selected: boolean;
  expanded: boolean;
  children?: NodeState<Item>[];
  item: Item;
}

function mapChildren<P extends { children?: P[] }>(
  children: P[],
  parentId?: string,
): NodeState<P>[] {
  const nodes: NodeState<P>[] = [];
  let count = 0;
  for (const item of children) {
    count++;
    const id = parentId ? `${parentId}.${count}` : `${count}`;
    const node: NodeState<P> = {
      id,
      selected: false,
      expanded: false,
      item,
    };
    if (item.children) {
      node.children = mapChildren(item.children, id);
    }
    nodes.push(node);
  }
  return nodes;
}

export function kvTreeToNodes(
  tree: KvKeyTreeJSON,
): NodeState<KvKeyTreeNodeJSON>[] {
  return tree.children ? mapChildren(tree.children) : [];
}

function selectedChild(children: NodeState<unknown>[]): boolean {
  for (const child of children) {
    if (child.selected) {
      return true;
    }
    if (child.children) {
      const selected = selectedChild(child.children);
      if (selected) {
        return true;
      }
    }
  }
  return false;
}

function appendChildren<Item>(
  nodes: TreeNode<Item>[],
  stateChildren: NodeState<Item>[],
  depth = 0,
) {
  for (const { id, selected, expanded, children, item } of stateChildren) {
    const node: TreeNode<Item> = {
      id,
      depth,
      checked: selected,
      expanded,
      disabled: false,
      indeterminate: Boolean(!selected && children && selectedChild(children)),
      leaf: !children,
      item,
    };
    nodes.push(node);
    if (expanded && children) {
      appendChildren(nodes, children, depth + 1);
    }
  }
}

function appendSelected(
  items: KvKeyJSON[],
  stateChildren: NodeState<KvKeyTreeNodeJSON>[],
  parent: KvKeyJSON = [],
) {
  for (const { selected, item, children } of stateChildren) {
    const key = [...parent, item.part];
    if (selected) {
      items.push(key);
    }
    if (children) {
      appendSelected(items, children, key);
    }
  }
}

function find<Item>(
  nodes: NodeState<Item>[],
  id: string,
): NodeState<Item> | undefined {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }
    if (node.children && id.startsWith(`${node.id}.`)) {
      return find(node.children, id);
    }
  }
}

export function toggleExpanded(
  nodes: Signal<NodeState<unknown>[]>,
  id: string,
) {
  const node = find(nodes.value, id);
  if (node) {
    node.expanded = !node.expanded;
    nodes.value = [...nodes.value];
  }
}

function updateSelectedChildren(node: NodeState<unknown>) {
  if (node.children) {
    for (const child of node.children) {
      child.selected = node.selected;
      updateSelectedChildren(child);
    }
  }
}

export function setSelected(
  nodes: Signal<NodeState<unknown>[]>,
  id: string,
  value: boolean,
) {
  const node = find(nodes.value, id);
  if (node) {
    node.selected = value;
    updateSelectedChildren(node);
    nodes.value = [...nodes.value];
  }
}

export function resetSelected(nodes: Signal<NodeState<unknown>[]>) {
  for (const node of nodes.value) {
    node.selected = false;
    updateSelectedChildren(node);
    nodes.value = [...nodes.value];
  }
}

export function createTreeState() {
  const tree: Signal<NodeState<KvKeyTreeNodeJSON>[]> = signal([]);

  const nodes = computed(() => {
    const nodes: TreeNode<KvKeyTreeNodeJSON>[] = [];
    appendChildren(nodes, tree.value);
    return nodes;
  });

  const selected = computed(() => {
    const selected: KvKeyJSON[] = [];
    appendSelected(selected, tree.value);
    return selected;
  });

  const selectedCount = computed(() => selected.value.length);
  return { tree, nodes, selected, selectedCount };
}

export const state = createTreeState();

export const TreeState = createContext(state);
