import assert from "node:assert/strict";
import test from "node:test";
import { filterCodeItems, getVisibleCategories } from "../../lib/data-structure-code/selectors.ts";
import type { CodeReviewItem } from "../../lib/data-structure-code/types.ts";

const base: CodeReviewItem = {
  id: "array-demo", chapter: 5, category: "线性表", title: "数组线性表", priority: "重点理解",
  topicIds: ["ch05-topic-04"], prerequisites: ["数组"], purpose: "顺序存储", steps: ["定位元素", "移动后继元素"],
  complexity: "O(n)", invariant: "前缀保持有序", pitfalls: ["注意容量"],
  textbookRef: { section: "arrayList", pdfPages: "PDF 第109-129页" }, code: "#include <vector>",
};
const fixtures: CodeReviewItem[] = [base, {
  ...base, id: "linked-list-reverse", chapter: 6, category: "核心操作", title: "链表反转", priority: "必会",
  topicIds: ["ch06-topic-04"], prerequisites: ["链表"], steps: ["保存后继指针", "更新前驱指针"],
}];

test("intersects chapter category priority and keyword", () => {
  const result = filterCodeItems(fixtures, { chapter: "6", category: "核心操作", priority: "必会", query: "反转" });
  assert.deepEqual(result.map((item) => item.id), ["linked-list-reverse"]);
});

test("searches prerequisites steps and pitfalls", () => {
  assert.equal(filterCodeItems(fixtures, { chapter: "all", category: "all", priority: "all", query: "前驱指针" }).length, 1);
});

test("all filters restore the full list and categories follow chapter", () => {
  assert.equal(filterCodeItems(fixtures, { chapter: "all", category: "all", priority: "all", query: "" }).length, fixtures.length);
  assert.deepEqual(getVisibleCategories(fixtures, "6"), ["核心操作"]);
});
