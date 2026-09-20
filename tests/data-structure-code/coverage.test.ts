import assert from "node:assert/strict";
import test from "node:test";

import {
  CODE_LIBRARY_STATS,
  DATA_STRUCTURE_CODE_LIBRARY,
  DATA_STRUCTURE_TOPIC_COVERAGE,
} from "../../lib/data-structure-code/index.ts";
import { validateCodeLibrary } from "../../lib/data-structure-code/validate.ts";

test("accounts for all 146 textbook topics", () => {
  assert.equal(DATA_STRUCTURE_TOPIC_COVERAGE.length, 146);
  assert.equal(new Set(DATA_STRUCTURE_TOPIC_COVERAGE.map((item) => item.topicId)).size, 146);
  assert.equal(CODE_LIBRARY_STATS.totalTopics, 146);
  assert.equal(CODE_LIBRARY_STATS.accountedTopics, 146);
});

test("the complete library has no structural or reference errors", () => {
  assert.deepEqual(validateCodeLibrary({
    items: DATA_STRUCTURE_CODE_LIBRARY,
    coverage: DATA_STRUCTURE_TOPIC_COVERAGE,
  }), []);
});
