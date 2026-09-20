import test from "node:test";
import { assertRequiredIds } from "./required-ids-helper.ts";

test("chapters 16-17 contain graph and greedy programs", () => assertRequiredIds({
  16: ["adjacency-matrix-graph", "adjacency-list", "graph-traversal", "graph-path-reconstruction", "connected-components", "dfs-spanning-tree"],
  17: ["greedy-container-loading", "fractional-knapsack", "topological-sort", "binary-covering", "dijkstra", "prim-mst", "kruskal"],
}));
