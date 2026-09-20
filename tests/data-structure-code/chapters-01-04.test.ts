import test from "node:test";
import { assertRequiredIds } from "./required-ids-helper.ts";

test("chapters 1-4 contain the textbook review programs", () => assertRequiredIds({
  1: ["pass-by-reference", "checked-array-access", "dynamic-array-raii", "dynamic-2d-array", "recursive-sum", "permutations", "stl-algorithm-pipeline", "assertion-test-harness"],
  2: ["sequential-search", "insertion-sort", "bubble-sort", "recursive-space-count", "operation-counting", "best-average-worst-inputs"],
  3: ["binary-search", "horner", "growth-check", "growth-rate-table", "recurrence-call-counter"],
  4: ["benchmark", "benchmark-statistics", "cache-loop-order", "matrix-multiply-loop-orders", "repeatable-data-generator"],
}));
