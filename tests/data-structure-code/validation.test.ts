import assert from "node:assert/strict";
import test from "node:test";

import { validateCodeLibrary } from "../../lib/data-structure-code/validate.ts";
import type { CodeReviewItem, TopicCoverage } from "../../lib/data-structure-code/types.ts";

const item: CodeReviewItem = {
  id: "sample",
  chapter: 1,
  category: "基础实现",
  title: "示例",
  priority: "必会",
  topicIds: ["ch01-topic-01"],
  prerequisites: ["函数"],
  purpose: "验证结构",
  steps: ["读取输入", "返回结果"],
  complexity: "时间 O(1)，空间 O(1)。",
  invariant: "返回前状态有效。",
  pitfalls: ["不要遗漏返回值"],
  textbookRef: { section: "1.1 函数与参数", pdfPages: "PDF 第19-22页" },
  code: "#include <cstddef>\nint sample() { return 0; }",
};

const coverage: TopicCoverage = {
  topicId: "ch01-topic-01",
  chapter: 1,
  topic: "函数与参数",
  status: "code",
  codeIds: ["sample"],
};

test("reports duplicate code ids", () => {
  const errors = validateCodeLibrary({ items: [item, item], coverage: [coverage] });
  assert.ok(errors.some((error) => error.includes("duplicate code id: sample")));
});

test("reports broken coverage references", () => {
  const errors = validateCodeLibrary({ items: [item], coverage: [{ ...coverage, codeIds: ["missing"] }] });
  assert.ok(errors.some((error) => error.includes("unknown code id: missing")));
});

test("requires a reason for theory-only topics", () => {
  const errors = validateCodeLibrary({ items: [], coverage: [{ ...coverage, status: "theory", codeIds: [] }] });
  assert.ok(errors.some((error) => error.includes("theory reason")));
});

test("reports missing topic coverage and malformed teaching fields", () => {
  const errors = validateCodeLibrary({
    items: [{ ...item, steps: ["只有一步"], textbookRef: { section: "", pdfPages: "" } }],
    coverage: [],
  });
  assert.ok(errors.some((error) => error.includes("fewer than two steps")));
  assert.ok(errors.some((error) => error.includes("empty textbook reference")));
  assert.ok(errors.some((error) => error.includes("missing coverage")));
});

test("accepts one complete record", () => {
  assert.deepEqual(validateCodeLibrary({ items: [item], coverage: [coverage] }), []);
});
