import assert from "node:assert/strict";
import { DATA_STRUCTURE_CODE_LIBRARY } from "../../lib/data-structure-code/index.ts";

export function assertRequiredIds(required: Record<number, readonly string[]>) {
  for (const [chapterText, ids] of Object.entries(required)) {
    const chapter = Number(chapterText);
    const items = DATA_STRUCTURE_CODE_LIBRARY.filter((item) => item.chapter === chapter);
    const byId = new Map(items.map((item) => [item.id, item]));
    for (const id of ids) {
      const item = byId.get(id);
      assert.ok(item, `chapter ${chapter} missing ${id}`);
      assert.match(item.code.trimStart(), /^#include\b/, `${id} must be a standalone C++17 review sample`);
    }
  }
}
