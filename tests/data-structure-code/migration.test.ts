import assert from "node:assert/strict";
import test from "node:test";

import { DATA_STRUCTURE_CODE_LIBRARY } from "../../lib/data-structure-code/index.ts";

const preservedIds = [
  "recursive-sum", "array-list-edit", "union-find", "sparse-transpose", "circular-queue",
  "tree-traversal", "heapify-sort", "bst-delete", "avl-rebalance", "graph-traversal",
  "dijkstra", "merge-sort", "knapsack-dp", "tsp-backtrack", "tsp-branch-bound",
];

test("preserves the existing library while adding the richer schema", () => {
  const ids = new Set(DATA_STRUCTURE_CODE_LIBRARY.map((item) => item.id));
  assert.ok(DATA_STRUCTURE_CODE_LIBRARY.length >= 63);
  for (const id of preservedIds) assert.ok(ids.has(id), id);
  for (const item of DATA_STRUCTURE_CODE_LIBRARY) {
    assert.ok(item.category);
    assert.ok(item.topicIds.length > 0);
    assert.ok(item.prerequisites.length > 0);
    assert.ok(item.steps.length >= 2);
    assert.ok(item.textbookRef.section);
    assert.ok(item.textbookRef.pdfPages);
  }
});
