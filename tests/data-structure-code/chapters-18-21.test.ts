import test from "node:test";
import { assertRequiredIds } from "./required-ids-helper.ts";

test("chapters 18-21 contain the algorithm design programs", () => assertRequiredIds({
  18: ["tromino-board", "merge-sort", "quick-sort", "quickselect", "closest-pair", "recurrence-experiment", "comparison-lower-bound"],
  19: ["knapsack-dp", "matrix-chain-dp", "floyd", "bellman-ford", "noncrossing-subset-dp"],
  20: ["container-loading-backtracking", "backtracking-knapsack", "maximum-clique-backtrack", "tsp-backtrack", "board-arrangement-backtracking"],
  21: ["branch-bound-loading", "best-first-knapsack", "maximum-clique-branch-bound", "tsp-branch-bound", "board-arrangement-branch-bound"],
}));
