import assert from "node:assert/strict";
import test from "node:test";

import {
  DATA_STRUCTURE_CHAPTERS,
  DATA_STRUCTURE_TOPIC_COUNT,
  makeTopicId,
} from "../../lib/data-structure-code/topic-catalog.ts";

test("the textbook outline has 21 chapters and 146 topics", () => {
  assert.equal(DATA_STRUCTURE_CHAPTERS.length, 21);
  assert.equal(DATA_STRUCTURE_TOPIC_COUNT, 146);
  assert.equal(DATA_STRUCTURE_CHAPTERS[0].title, "第1章 C++回顾");
  assert.equal(DATA_STRUCTURE_CHAPTERS[20].title, "第21章 分支定界");
});

test("topic ids include chapter and topic position", () => {
  assert.equal(makeTopicId(1, 1), "ch01-topic-01");
  assert.equal(makeTopicId(21, 6), "ch21-topic-06");
  assert.notEqual(makeTopicId(8, 1), makeTopicId(9, 1));
});
