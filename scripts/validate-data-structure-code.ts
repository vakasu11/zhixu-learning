import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";

import { DATA_STRUCTURE_CODE_LIBRARY, DATA_STRUCTURE_TOPIC_COVERAGE } from "../lib/data-structure-code/index.ts";
import { validateCodeLibrary } from "../lib/data-structure-code/validate.ts";

const execFileAsync = promisify(execFile);

export type ValidationReport = {
  structuralErrors: string[];
  cpp: { status: "passed" | "failed" | "skipped"; errors: string[]; compiler?: string; message?: string };
};

export type ValidationOptions = {
  findCompiler: () => Promise<string | null>;
  compile: (id: string, code: string, compiler: string) => Promise<string | null>;
};

async function defaultFindCompiler() {
  for (const compiler of ["g++", "clang++", "cl"]) {
    try {
      const command = process.platform === "win32" ? "where.exe" : "which";
      const { stdout } = await execFileAsync(command, [compiler]);
      const path = stdout.trim().split(/\r?\n/)[0];
      if (path) return path;
    } catch {
      // Try the next compiler.
    }
  }
  return null;
}

async function defaultCompile(id: string, code: string, compiler: string) {
  const directory = await mkdtemp(join(tmpdir(), "zhixu-cpp17-"));
  const source = join(directory, `${id}.cpp`);
  try {
    await writeFile(source, code, "utf8");
    const isMsvc = basename(compiler).toLocaleLowerCase().startsWith("cl");
    const args = isMsvc ? ["/nologo", "/std:c++17", "/Zs", source] : ["-std=c++17", "-fsyntax-only", source];
    try {
      await execFileAsync(compiler, args, { maxBuffer: 2_000_000 });
      return null;
    } catch (error) {
      const detail = error as { stderr?: string; stdout?: string; message?: string };
      return (detail.stderr || detail.stdout || detail.message || "unknown compiler error").trim();
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

export async function runCodeLibraryValidation(options: Partial<ValidationOptions> = {}): Promise<ValidationReport> {
  const findCompiler = options.findCompiler ?? defaultFindCompiler;
  const compile = options.compile ?? defaultCompile;
  const structuralErrors = validateCodeLibrary({
    items: DATA_STRUCTURE_CODE_LIBRARY,
    coverage: DATA_STRUCTURE_TOPIC_COVERAGE,
  });
  const compiler = await findCompiler();
  if (!compiler) {
    return { structuralErrors, cpp: { status: "skipped", errors: [], message: "no C++ compiler found" } };
  }

  const errors: string[] = [];
  for (const item of DATA_STRUCTURE_CODE_LIBRARY) {
    const compilerError = await compile(item.id, item.code, compiler);
    if (compilerError) errors.push(`${item.id}: ${compilerError}`);
  }
  return {
    structuralErrors,
    cpp: { status: errors.length ? "failed" : "passed", errors, compiler },
  };
}

const directEntry = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (directEntry) {
  const report = await runCodeLibraryValidation();
  console.log(`结构校验：${report.structuralErrors.length === 0 ? "通过" : `失败 ${report.structuralErrors.length} 项`}`);
  console.log(`C++17 语法校验：${report.cpp.status}${report.cpp.compiler ? ` (${report.cpp.compiler})` : ""}${report.cpp.message ? ` - ${report.cpp.message}` : ""}`);
  for (const error of [...report.structuralErrors, ...report.cpp.errors]) console.error(error);
  if (report.structuralErrors.length > 0 || report.cpp.status === "failed") process.exitCode = 1;
}
