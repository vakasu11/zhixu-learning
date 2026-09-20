import test from "node:test";
import { assertRequiredIds } from "./required-ids-helper.ts";

test("chapters 8-10 contain stack queue dictionary and compression programs", () => assertRequiredIds({
  8: ["array-stack", "linked-stack", "bracket-stack", "postfix-evaluation", "hanoi-recursive", "train-rearrangement-stack", "switchbox-routing", "maze-backtracking"],
  9: ["circular-queue", "linked-queue", "queue-train", "grid-shortest-path", "image-component-labeling", "factory-event-simulation"],
  10: ["sorted-dictionary", "skip-list-search", "skip-list-update", "division-hash", "linear-probing", "chained-hash", "lzw-encode", "lzw-decode"],
}));
