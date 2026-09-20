import assert from "node:assert/strict";
import test from "node:test";
import { runCodeLibraryValidation } from "../../scripts/validate-data-structure-code.ts";

test("structural validation succeeds and skips C++ checks without a compiler", async () => {
  const report = await runCodeLibraryValidation({
    findCompiler: async () => null,
    compile: async () => { throw new Error("compile must not run"); },
  });
  assert.equal(report.structuralErrors.length, 0);
  assert.equal(report.cpp.status, "skipped");
});

test("reports the exact code id when syntax checking fails", async () => {
  const report = await runCodeLibraryValidation({
    findCompiler: async () => "g++",
    compile: async (id) => id === "recursive-sum" ? "expected ;" : null,
  });
  assert.ok(report.cpp.errors.some((error) => error.includes("recursive-sum")));
  assert.equal(report.cpp.status, "failed");
});
