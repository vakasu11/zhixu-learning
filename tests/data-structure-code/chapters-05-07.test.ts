import test from "node:test";
import { assertRequiredIds } from "./required-ids-helper.ts";

test("chapters 5-7 contain lists and matrix programs", () => assertRequiredIds({
  5: ["array-resize", "array-list-edit", "array-iterator", "vector-operation-demo", "array-multiple-lists"],
  6: ["singly-linked-list", "circular-list-with-header", "doubly-linked-list", "reverse-list", "bin-sort", "radix-sort", "convex-hull-chain", "union-find"],
  7: ["row-major-index", "matrix-class", "diagonal-matrix", "lower-triangular-matrix", "symmetric-matrix", "tri-diagonal", "sparse-transpose", "sparse-add", "sparse-multiply"],
}));
