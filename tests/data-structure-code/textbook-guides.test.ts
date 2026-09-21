import assert from "node:assert/strict";
import test from "node:test";
import * as textbookLibrary from "../../lib/textbook-code-library.ts";

type Guide = {
  textbookScope: string;
  prerequisites: readonly string[];
  steps: readonly string[];
  complexity: string;
  invariant: string;
  pitfalls: readonly string[];
};

const getGuide = (textbookLibrary as unknown as {
  getTextbookCodeGuide?: (item: (typeof textbookLibrary.TEXTBOOK_CODE_LIBRARY)[number]) => Guide;
}).getTextbookCodeGuide;

test("every textbook source file receives all six learning-guide sections", () => {
  assert.equal(typeof getGuide, "function", "getTextbookCodeGuide must be implemented");
  if (!getGuide) return;

  for (const item of textbookLibrary.TEXTBOOK_CODE_LIBRARY) {
    const guide = getGuide(item);
    assert.ok(guide.textbookScope.trim(), `${item.id} needs a textbook scope`);
    assert.ok(guide.prerequisites.length >= 2, `${item.id} needs prerequisites`);
    assert.ok(guide.steps.length >= 3, `${item.id} needs execution steps`);
    assert.ok(guide.complexity.trim(), `${item.id} needs complexity analysis`);
    assert.ok(guide.invariant.trim(), `${item.id} needs an invariant`);
    assert.ok(guide.pitfalls.length >= 2, `${item.id} needs pitfalls`);
  }
});

test("guides explain representative algorithms instead of returning generic placeholders", () => {
  assert.equal(typeof getGuide, "function", "getTextbookCodeGuide must be implemented");
  if (!getGuide) return;

  const arrayList = textbookLibrary.TEXTBOOK_CODE_LIBRARY.find((item) => item.programNumbers.includes("5.4"));
  const quickSort = textbookLibrary.TEXTBOOK_CODE_LIBRARY.find((item) => item.programNumbers.includes("18.6"));
  const bellmanFord = textbookLibrary.TEXTBOOK_CODE_LIBRARY.find((item) => item.programNumbers.includes("19.10"));
  assert.ok(arrayList && quickSort && bellmanFord);

  assert.match(getGuide(arrayList).complexity, /扩容|O\(n\)/);
  assert.match(getGuide(arrayList).invariant, /listSize|arrayLength/);
  assert.match(getGuide(quickSort).steps.join(" "), /枢轴|划分/);
  assert.match(getGuide(quickSort).complexity, /O\(n log n\)|O\(n²\)/);
  assert.match(getGuide(bellmanFord).steps.join(" "), /松弛|负权/);
});

test("code search includes the added Chinese learning guide", () => {
  const results = textbookLibrary.filterTextbookCodeItems(textbookLibrary.TEXTBOOK_CODE_LIBRARY, {
    chapter: "all",
    query: "枢轴",
  });
  assert.ok(results.some((item) => item.sourceFile === "quickSort.h"));
});
