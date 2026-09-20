import test from "node:test";
import { assertRequiredIds } from "./required-ids-helper.ts";

test("chapters 11-15 contain tree and priority queue programs", () => assertRequiredIds({
  11: ["array-binary-tree", "linked-binary-tree", "tree-traversal", "iterative-tree-traversals", "tree-level-order", "tree-statistics", "tree-copy-and-equality"],
  12: ["max-heap", "heapify-sort", "leftist-tree-merge", "leftist-priority-queue", "machine-scheduling", "huffman"],
  13: ["winner-tree", "loser-tree", "k-way-merge", "first-fit-packing", "next-fit-packing"],
  14: ["bst", "bst-delete", "duplicate-key-bst", "indexed-bst", "histogram-bst", "best-fit-packing-bst", "cross-distribution"],
  15: ["avl-rotation", "avl-rebalance", "avl-delete", "red-black-insert-fix", "red-black-delete", "splay-tree", "b-tree-search", "b-tree-insert", "b-tree-delete"],
}));
