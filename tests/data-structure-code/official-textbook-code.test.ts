import assert from "node:assert/strict";
import test from "node:test";
import {
  OFFICIAL_TEXTBOOK_CODE,
  OFFICIAL_TEXTBOOK_PROGRAM_COUNT,
} from "../../lib/textbook-code-library.generated.ts";

test("official textbook index covers all 289 printed program entries", () => {
  const programNumbers = OFFICIAL_TEXTBOOK_CODE.flatMap((item) => item.programNumbers);
  assert.equal(OFFICIAL_TEXTBOOK_PROGRAM_COUNT, 289);
  assert.equal(programNumbers.length, 289);
  assert.equal(new Set(programNumbers).size, 289);
});

test("program entries are grouped by chapter and preserve verbatim source text", () => {
  for (const item of OFFICIAL_TEXTBOOK_CODE) {
    assert.ok(item.code.length > 0, `${item.sourceFile} must contain source text`);
    assert.ok(item.programNumbers.every((number) => Number(number.split(".")[0]) === item.chapter));
    assert.match(item.sourceFile, /\.(?:cpp|h)$/);
  }

  const program54 = OFFICIAL_TEXTBOOK_CODE.find((item) => item.programNumbers.includes("5.4"));
  assert.ok(program54);
  assert.equal(program54.sourceFile, "arrayList.h");
  assert.match(program54.code, /arrayList<T>::arrayList\(int initialCapacity\)/);
  assert.match(program54.code, /element = new T\[arrayLength\];/);
});

test("official index typos are corrected without changing source bodies", () => {
  const program71 = OFFICIAL_TEXTBOOK_CODE.find((item) => item.programNumbers.includes("7.1"));
  assert.ok(program71);
  assert.equal(program71.sourceFile, "irregularArray.cpp");
  assert.match(program71.code, /int \*\*irregularArray = new int\* \[numberOfRows\];/);

  const program171 = OFFICIAL_TEXTBOOK_CODE.find((item) => item.programNumbers.includes("17.1"));
  assert.ok(program171);
  assert.equal(program171.sourceFile, "greedyLoading.cpp");
});

test("chapter 15 has no program in the official printed-program index", () => {
  assert.equal(OFFICIAL_TEXTBOOK_CODE.some((item) => item.chapter === 15), false);
  assert.deepEqual(
    [...new Set(OFFICIAL_TEXTBOOK_CODE.map((item) => item.chapter))],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21],
  );
});
