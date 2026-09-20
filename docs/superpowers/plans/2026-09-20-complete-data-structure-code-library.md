# Complete Data Structures Code Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, original C++17 review library that accounts for all 146 data-structures topics across 21 chapters and remains easy to browse on mobile.

**Architecture:** Move the data-structures outline into a pure topic catalog, split code content into 21 chapter modules, and join them through one typed index. A coverage manifest maps every topic to code, an experiment, a related implementation, or an explained theory-only status; pure validators and selectors make completeness and UI behavior testable without rendering the full app.

**Tech Stack:** TypeScript 5.9, Node.js built-in test runner with type stripping, React 19, Vite 8, Tailwind CSS 4, optional local `g++` C++17 syntax checks.

**Spec:** `docs/superpowers/specs/2026-09-20-complete-data-structure-code-library-design.md`

## Global Constraints

- The course scope is exactly the existing 21 chapters and 146 topics in the data-structures outline.
- Every code sample is an original C++17 teaching implementation, not copied line-for-line from the textbook, slides, or third-party repositories.
- Every sample includes the headers, declarations, and helpers needed for an independent C++17 syntax check; `main` is optional.
- Every code item supplies `category`, `topicIds`, `prerequisites`, `steps`, `purpose`, `complexity`, `invariant`, `pitfalls`, and `code`.
- No online compiler, code execution backend, judge, sandbox, learner-code upload, new runtime dependency, or database dependency is added.
- Private SDU deep links and unauthorized course files are not published.
- Knowledge explanation remains primary; this work does not create a large exercise bank.
- Existing blue-gray, navy, and amber visual styling remains the base design.
- Do not claim full TypeScript health when only the GitHub Pages Vite build passes; report pre-existing type errors separately.

## Review Focus

1. Duplicate topic names in different chapters must still produce distinct stable IDs; Task 1 tests IDs by chapter and topic position.
2. Chapter, category, priority, and keyword filters must intersect correctly and reset to a recoverable empty state; Task 10 tests each combination.
3. Very long C++ lines must scroll inside the code panel without causing page-level horizontal overflow at 390px; Task 10 includes browser verification.
4. Clipboard permission rejection must keep the page usable and show the existing manual-copy message; Task 10 preserves and manually verifies the failure path.
5. Machines without `g++` must still run structural validation and clearly report that C++ syntax checking was skipped; Task 11 tests both compiler-present and compiler-absent results through dependency injection.

---

### Task 1: Establish the Pure Topic Catalog and Test Harness

**Files:**
- Create: `lib/data-structure-code/topic-catalog.ts`
- Create: `tests/data-structure-code/topic-catalog.test.ts`
- Modify: `lib/study-content.ts:1-43`
- Modify: `tsconfig.json:2-30`
- Modify: `package.json:8-17`

**Interfaces:**
- Consumes: the current data-structures `chapters` array in `lib/study-content.ts`.
- Produces: `DATA_STRUCTURE_CHAPTERS`, `DATA_STRUCTURE_TOPIC_COUNT`, and `makeTopicId(chapter: number, topicIndex: number): string`.

- [ ] **Step 1: Add a failing catalog test**

```ts
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
```

- [ ] **Step 2: Run the test and verify the missing-module failure**

Run: `node --experimental-strip-types --test tests/data-structure-code/topic-catalog.test.ts`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `topic-catalog.ts`.

- [ ] **Step 3: Create the catalog and make it the course source of truth**

```ts
export type DataStructureChapter = {
  title: string;
  source: string;
  topics: string[];
};

export const makeTopicId = (chapter: number, topicIndex: number) =>
  `ch${String(chapter).padStart(2, "0")}-topic-${String(topicIndex).padStart(2, "0")}`;

export const DATA_STRUCTURE_CHAPTERS: DataStructureChapter[] = [
  { title: "第1章 C++回顾", source: "PDF第19-54页（书中第2-37页）", topics: ["函数与参数", "异常处理", "动态内存分配", "自定义数据类型", "递归函数", "标准模板库 STL", "测试与调试"] },
  { title: "第2章 程序性能分析", source: "PDF第55-80页（书中第38-63页）", topics: ["程序性能", "空间复杂度", "时间复杂度", "操作计数", "最好、最坏与平均复杂度"] },
  { title: "第3章 渐近记法", source: "PDF第81-97页（书中第64-80页）", topics: ["大 O 记法", "Ω 记法", "Θ 记法", "小 o 记法", "复杂度分析", "实际复杂度"] },
  { title: "第4章 性能测量", source: "PDF第98-108页（书中第81-91页）", topics: ["实例规模选择", "测试数据设计", "实验设计", "高速缓存影响", "矩阵乘法性能"] },
  { title: "第5章 线性表—数组描述", source: "PDF第109-129页（书中第92-112页）", topics: ["数据对象与数据结构", "线性表抽象数据类型", "变长数组", "arrayList", "C++ 迭代器", "vector", "数组中的多重表"] },
  { title: "第6章 线性表—链式描述", source: "PDF第130-162页（书中第113-145页）", topics: ["单向链表", "循环链表与头节点", "双向链表", "链表插入与删除", "箱子排序", "基数排序", "凸包", "并查集"] },
  { title: "第7章 数组和矩阵", source: "PDF第163-191页（书中第146-174页）", topics: ["数组映射", "二维数组", "矩阵抽象数据类型", "特殊矩阵", "稀疏矩阵", "矩阵压缩存储"] },
  { title: "第8章 栈", source: "PDF第192-221页（书中第175-204页）", topics: ["栈的抽象数据类型", "数组栈", "链式栈", "括号匹配", "汉诺塔", "列车车厢重排", "开关盒布线", "迷宫老鼠"] },
  { title: "第9章 队列", source: "PDF第222-251页（书中第205-234页）", topics: ["队列的抽象数据类型", "数组队列与循环队列", "链式队列", "列车车厢重排—队列", "电路布线", "图元识别", "工厂仿真"] },
  { title: "第10章 跳表和散列", source: "PDF第252-286页（书中第235-269页）", topics: ["字典抽象数据类型", "有序线性表", "跳表", "散列函数与散列表", "线性探查", "链式散列", "LZW 文本压缩"] },
  { title: "第11章 二叉树和其他树", source: "PDF第287-313页（书中第270-296页）", topics: ["树的基本概念", "二叉树", "二叉树的特性", "二叉树的数组与链式描述", "二叉树常用操作", "二叉树遍历", "linkedBinaryTree", "树的应用"] },
  { title: "第12章 优先级队列", source: "PDF第314-339页（书中第297-322页）", topics: ["优先级队列抽象数据类型", "大根堆", "堆的插入与删除", "堆的初始化", "左高树 HBLT", "堆排序", "机器调度", "霍夫曼编码"] },
  { title: "第13章 竞赛树", source: "PDF第340-354页（书中第323-337页）", topics: ["赢者树", "WinnerTree 抽象数据类型", "赢者树的实现", "输者树", "首次适配装箱", "相邻适配装箱"] },
  { title: "第14章 搜索树", source: "PDF第355-375页（书中第338-358页）", topics: ["二叉搜索树", "索引二叉搜索树", "BST 搜索、插入与删除", "重复关键字处理", "索引 BST", "直方图", "最佳匹配装箱", "交叉分布"] },
  { title: "第15章 平衡搜索树", source: "PDF第376-406页（书中第359-389页）", topics: ["AVL 树", "AVL 旋转", "红黑树", "红黑树插入与删除", "分裂树", "B 树", "B 树插入与删除"] },
  { title: "第16章 图", source: "PDF第407-436页（书中第390-419页）", topics: ["图的基本概念", "图的特性", "无权图与加权图", "邻接矩阵与邻接表", "广度优先搜索 BFS", "深度优先搜索 DFS", "路径查找", "连通分量", "生成树"] },
  { title: "第17章 贪婪算法", source: "PDF第437-462页（书中第420-445页）", topics: ["最优化问题", "贪婪选择思想", "货箱装载", "0/1 背包的贪婪尝试", "拓扑排序", "二分覆盖", "单源最短路径", "最小成本生成树"] },
  { title: "第18章 分而治之", source: "PDF第463-495页（书中第446-478页）", topics: ["分治算法思想", "线路棋盘", "归并排序", "快速排序", "选择问题", "最近点对", "递归方程", "复杂度下限"] },
  { title: "第19章 动态规划", source: "PDF第496-518页（书中第479-501页）", topics: ["动态规划思想", "0/1 背包—动态规划", "矩阵乘法链", "所有顶点对最短路径", "含负权单源最短路径", "网组的无交叉子集"] },
  { title: "第20章 回溯法", source: "PDF第519-541页（书中第502-524页）", topics: ["回溯算法思想", "货箱装载—回溯", "0/1 背包—回溯", "最大完备子图", "旅行商问题—回溯", "电路板排列—回溯"] },
  { title: "第21章 分支定界", source: "PDF第542-561页（书中第525-544页）", topics: ["分支定界思想", "货箱装载—分支定界", "0/1 背包—分支定界", "最大完备子图—分支定界", "旅行商问题—分支定界", "电路板排列—分支定界"] },
];

export const DATA_STRUCTURE_TOPIC_COUNT = DATA_STRUCTURE_CHAPTERS.reduce(
  (count, chapter) => count + chapter.topics.length,
  0,
);
```

Replace the data-structures course's inline `chapters` value with `chapters: DATA_STRUCTURE_CHAPTERS`. Add `allowImportingTsExtensions: true` to `tsconfig.json`, and add this script:

```json
"test:code-library": "node --experimental-strip-types --test tests/data-structure-code/*.test.ts"
```

- [ ] **Step 4: Run catalog tests and the GitHub build**

Run: `npm run test:code-library`

Expected: 2 tests PASS.

Run: `npm run build:github`

Expected: exit code 0 and a generated `github-pages-dist` directory.

- [ ] **Step 5: Commit the shared catalog**

```powershell
git add lib/data-structure-code/topic-catalog.ts tests/data-structure-code/topic-catalog.test.ts lib/study-content.ts tsconfig.json package.json
git commit -m "refactor: centralize data structure topic catalog"
```

### Task 2: Define Contracts and Structural Validation

**Files:**
- Create: `lib/data-structure-code/types.ts`
- Create: `lib/data-structure-code/validate.ts`
- Create: `tests/data-structure-code/validation.test.ts`

**Interfaces:**
- Consumes: `DATA_STRUCTURE_CHAPTERS` and `makeTopicId` from Task 1.
- Produces: `CodeReviewItem`, `TopicCoverage`, `CodeLibraryValidationInput`, and `validateCodeLibrary(input): string[]`.

- [ ] **Step 1: Write failing validation tests**

```ts
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
  const errors = validateCodeLibrary({
    items: [item],
    coverage: [{ ...coverage, codeIds: ["missing"] }],
  });
  assert.ok(errors.some((error) => error.includes("unknown code id: missing")));
});

test("requires a reason for theory-only topics", () => {
  const errors = validateCodeLibrary({
    items: [],
    coverage: [{ ...coverage, status: "theory", codeIds: [] }],
  });
  assert.ok(errors.some((error) => error.includes("theory reason")));
});
```

- [ ] **Step 2: Run tests and verify missing exports fail**

Run: `npm run test:code-library`

Expected: FAIL because `types.ts` and `validate.ts` do not exist.

- [ ] **Step 3: Implement the contracts and validator**

```ts
export type CodePriority = "必会" | "重点理解" | "拓展";
export type TopicCoverageStatus = "code" | "experiment" | "related" | "theory";

export type CodeReviewItem = {
  id: string;
  chapter: number;
  category: string;
  title: string;
  priority: CodePriority;
  topicIds: string[];
  prerequisites: string[];
  purpose: string;
  steps: string[];
  complexity: string;
  invariant: string;
  pitfalls: string[];
  code: string;
};

export type TopicCoverage = {
  topicId: string;
  chapter: number;
  topic: string;
  status: TopicCoverageStatus;
  codeIds: string[];
  reason?: string;
};
```

`validateCodeLibrary` must accumulate readable errors for duplicate IDs, invalid chapters, empty fields, fewer than two steps, unknown topic/code references, missing coverage records, theory records with code, and non-theory records without code.

- [ ] **Step 4: Run the validation tests**

Run: `npm run test:code-library`

Expected: all catalog and validation tests PASS.

- [ ] **Step 5: Commit contracts and validation**

```powershell
git add lib/data-structure-code/types.ts lib/data-structure-code/validate.ts tests/data-structure-code/validation.test.ts
git commit -m "test: define code library validation contracts"
```

### Task 3: Migrate the Existing 63 Topics into Chapter Modules

**Files:**
- Create: `lib/data-structure-code/chapters/chapter-01.ts` through `lib/data-structure-code/chapters/chapter-21.ts`
- Create: `lib/data-structure-code/index.ts`
- Create: `tests/data-structure-code/migration.test.ts`
- Modify: `lib/data-structure-code-library.ts:1-end`

**Interfaces:**
- Consumes: `CodeReviewItem` and stable topic IDs from Tasks 1-2.
- Produces: `DATA_STRUCTURE_CODE_LIBRARY`, `CODE_LIBRARY_CHAPTERS`, `CODE_LIBRARY_CATEGORIES`, and compatibility exports from the old module path.

- [ ] **Step 1: Write a failing migration-preservation test**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { DATA_STRUCTURE_CODE_LIBRARY } from "../../lib/data-structure-code/index.ts";

const preservedIds = [
  "recursive-sum",
  "array-list-edit",
  "union-find",
  "sparse-transpose",
  "circular-queue",
  "tree-traversal",
  "heapify-sort",
  "bst-delete",
  "avl-rebalance",
  "graph-traversal",
  "dijkstra",
  "merge-sort",
  "knapsack-dp",
  "tsp-backtrack",
  "tsp-branch-bound",
];

test("preserves the existing library while adding the richer schema", () => {
  const ids = new Set(DATA_STRUCTURE_CODE_LIBRARY.map((item) => item.id));
  assert.ok(DATA_STRUCTURE_CODE_LIBRARY.length >= 63);
  for (const id of preservedIds) assert.ok(ids.has(id), id);
  for (const item of DATA_STRUCTURE_CODE_LIBRARY) {
    assert.ok(item.category);
    assert.ok(item.topicIds.length > 0);
    assert.ok(item.prerequisites.length > 0);
    assert.ok(item.steps.length >= 2);
  }
});
```

- [ ] **Step 2: Run the migration test and verify the missing index failure**

Run: `npm run test:code-library`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `lib/data-structure-code/index.ts`.

- [ ] **Step 3: Split and enrich the existing data**

Move every current object to its matching chapter file. Add a chapter-specific `category`, valid `topicIds`, concrete prerequisites, and ordered steps. Export each file as `chapter01Code`, `chapter02Code`, through `chapter21Code`.

```ts
import type { CodeReviewItem } from "../types.ts";

export const chapter01Code: CodeReviewItem[] = [
  {
    id: "recursive-sum",
    chapter: 1,
    category: "递归基础",
    title: "递归求和：递归函数最小骨架",
    priority: "重点理解",
    topicIds: ["ch01-topic-05"],
    prerequisites: ["函数参数", "递归出口"],
    purpose: "看懂递归出口、规模缩小和调用栈。",
    steps: ["处理 n == 0 的空区间", "递归求前 n-1 项并加入末项"],
    complexity: "时间 O(n)，递归栈 O(n)。",
    invariant: "每次调用把问题从前 n 项缩小为前 n-1 项。",
    pitfalls: ["必须设置递归出口", "递归过深可能栈溢出"],
    code: "#include <cstddef>\n\ntemplate<class T>\nT recursiveSum(const T values[], std::size_t count) {\n    if (count == 0) return T{};\n    return recursiveSum(values, count - 1) + values[count - 1];\n}",
  },
];
```

`index.ts` imports all 21 arrays explicitly, flattens them once, and derives sorted unique chapter/category lists. Change `lib/data-structure-code-library.ts` to re-export from `./data-structure-code/index.ts` and `./data-structure-code/types.ts`; it must contain no duplicate content.

- [ ] **Step 4: Run migration and build checks**

Run: `npm run test:code-library`

Expected: all tests PASS and at least 63 items remain.

Run: `npm run build:github`

Expected: exit code 0 with the existing UI still rendering from compatibility exports.

- [ ] **Step 5: Commit the modular migration**

```powershell
git add lib/data-structure-code lib/data-structure-code-library.ts tests/data-structure-code/migration.test.ts
git commit -m "refactor: split code library into chapter modules"
```

### Task 4: Complete Chapters 1-4

**Files:**
- Modify: `lib/data-structure-code/chapters/chapter-01.ts`
- Modify: `lib/data-structure-code/chapters/chapter-02.ts`
- Modify: `lib/data-structure-code/chapters/chapter-03.ts`
- Modify: `lib/data-structure-code/chapters/chapter-04.ts`
- Create: `tests/data-structure-code/chapters-01-04.test.ts`

**Interfaces:**
- Consumes: `CodeReviewItem` and `ch01-topic-01` through `ch04-topic-05`.
- Produces: complete code/experiment coverage for C++ review, performance analysis, asymptotic notation, and performance measurement.

- [ ] **Step 1: Write the failing required-ID test**

```ts
const required = {
  1: ["pass-by-reference", "checked-array-access", "dynamic-array-raii", "dynamic-2d-array", "recursive-sum", "permutations", "stl-algorithm-pipeline", "assertion-test-harness"],
  2: ["sequential-search", "insertion-sort", "bubble-sort", "recursive-space-count", "operation-counting", "best-average-worst-inputs"],
  3: ["binary-search", "horner", "growth-check", "growth-rate-table", "recurrence-call-counter"],
  4: ["benchmark", "benchmark-statistics", "cache-loop-order", "matrix-multiply-loop-orders", "repeatable-data-generator"],
} as const;
```

For each chapter, assert every required ID exists in that chapter and every sample begins with `#include`.

- [ ] **Step 2: Run and observe missing IDs**

Run: `npm run test:code-library`

Expected: FAIL listing the first missing ID in chapters 1-4.

- [ ] **Step 3: Add the missing original C++17 implementations**

Each listed ID gets one full `CodeReviewItem`. Performance-analysis entries must contain executable counters or controlled experiments rather than a prose-only placeholder. Matrix experiments must use deterministic input and keep output outside timed regions.

```ts
{
  id: "operation-counting",
  chapter: 2,
  category: "复杂度实验",
  title: "操作计数：把循环次数变成可观察数据",
  priority: "重点理解",
  topicIds: ["ch02-topic-04"],
  prerequisites: ["循环", "时间复杂度"],
  purpose: "用计数器验证基本操作次数随 n 的增长规律。",
  steps: ["执行双层循环并累计基本操作", "返回计数结果而不是墙钟时间"],
  complexity: "执行次数为 n(n-1)/2，属于 Θ(n²)。",
  invariant: "完成外层 i 轮后，计数等于前 i 轮内层迭代总数。",
  pitfalls: ["不要把输入生成计入基本操作", "计数验证不能代替严格证明"],
  code: "#include <cstddef>\n\nstd::size_t countTriangularLoop(std::size_t n) {\n    std::size_t operations = 0;\n    for (std::size_t i = 0; i < n; ++i)\n        for (std::size_t j = 0; j < i; ++j)\n            ++operations;\n    return operations;\n}",
}
```

- [ ] **Step 4: Run chapter and full tests**

Run: `npm run test:code-library`

Expected: chapters 1-4 required-ID test and all earlier tests PASS.

- [ ] **Step 5: Commit chapters 1-4**

```powershell
git add lib/data-structure-code/chapters/chapter-01.ts lib/data-structure-code/chapters/chapter-02.ts lib/data-structure-code/chapters/chapter-03.ts lib/data-structure-code/chapters/chapter-04.ts tests/data-structure-code/chapters-01-04.test.ts
git commit -m "feat: complete chapters 1 through 4 code reviews"
```

### Task 5: Complete Chapters 5-7

**Files:**
- Modify: `lib/data-structure-code/chapters/chapter-05.ts`
- Modify: `lib/data-structure-code/chapters/chapter-06.ts`
- Modify: `lib/data-structure-code/chapters/chapter-07.ts`
- Create: `tests/data-structure-code/chapters-05-07.test.ts`

**Interfaces:**
- Consumes: `CodeReviewItem` and topic IDs for chapters 5-7.
- Produces: complete array-list, linked-list, array, special-matrix, and sparse-matrix implementations.

- [ ] **Step 1: Write the failing required-ID test**

Require these exact IDs:

```ts
const required = {
  5: ["array-resize", "array-list-edit", "array-iterator", "vector-operation-demo", "array-multiple-lists"],
  6: ["singly-linked-list", "circular-list-with-header", "doubly-linked-list", "reverse-list", "bin-sort", "radix-sort", "convex-hull-chain", "union-find"],
  7: ["row-major-index", "matrix-class", "diagonal-matrix", "lower-triangular-matrix", "symmetric-matrix", "tri-diagonal", "sparse-transpose", "sparse-add", "sparse-multiply"],
} as const;
```

- [ ] **Step 2: Run and observe missing IDs**

Run: `npm run test:code-library`

Expected: FAIL on missing chapter 5-7 content.

- [ ] **Step 3: Implement all required structures and applications**

Every owning container must define its constructor/destructor or use RAII containers; linked structures must handle empty/head/tail cases; sparse operations must state tuple ordering; convex hull must define point orientation.

```cpp
#include <vector>
#include <stdexcept>

class DiagonalMatrix {
    std::vector<int> diagonal_;
public:
    explicit DiagonalMatrix(int size) : diagonal_(size) {}
    int get(int row, int column) const {
        if (row < 0 || column < 0 || row >= size() || column >= size())
            throw std::out_of_range("matrix index");
        return row == column ? diagonal_[row] : 0;
    }
    void set(int row, int column, int value) {
        if (row != column && value != 0) throw std::invalid_argument("off-diagonal");
        if (row == column) diagonal_.at(row) = value;
    }
    int size() const { return static_cast<int>(diagonal_.size()); }
};
```

- [ ] **Step 4: Run all content tests**

Run: `npm run test:code-library`

Expected: chapters 5-7 and all earlier tests PASS.

- [ ] **Step 5: Commit chapters 5-7**

```powershell
git add lib/data-structure-code/chapters/chapter-05.ts lib/data-structure-code/chapters/chapter-06.ts lib/data-structure-code/chapters/chapter-07.ts tests/data-structure-code/chapters-05-07.test.ts
git commit -m "feat: complete linear list and matrix code reviews"
```

### Task 6: Complete Chapters 8-10

**Files:**
- Modify: `lib/data-structure-code/chapters/chapter-08.ts`
- Modify: `lib/data-structure-code/chapters/chapter-09.ts`
- Modify: `lib/data-structure-code/chapters/chapter-10.ts`
- Create: `tests/data-structure-code/chapters-08-10.test.ts`

**Interfaces:**
- Consumes: topic IDs for chapters 8-10.
- Produces: stack, queue, dictionary, skip-list, hashing, and LZW implementations.

- [ ] **Step 1: Write the failing required-ID test**

```ts
const required = {
  8: ["array-stack", "linked-stack", "bracket-stack", "postfix-evaluation", "hanoi-recursive", "train-rearrangement-stack", "switchbox-routing", "maze-backtracking"],
  9: ["circular-queue", "linked-queue", "queue-train", "grid-shortest-path", "image-component-labeling", "factory-event-simulation"],
  10: ["sorted-dictionary", "skip-list-search", "skip-list-update", "division-hash", "linear-probing", "chained-hash", "lzw-encode", "lzw-decode"],
} as const;
```

- [ ] **Step 2: Run and observe missing IDs**

Run: `npm run test:code-library`

Expected: FAIL on missing chapter 8-10 content.

- [ ] **Step 3: Implement all required entries**

Stacks and queues must define underflow behavior. Skip-list update must include insert and erase. Linear probing must use an explicit tombstone state. LZW encode and decode must agree on dictionary initialization and the `code == nextCode` edge case.

```cpp
if (code < static_cast<int>(dictionary.size())) {
    entry = dictionary[code];
} else if (code == static_cast<int>(dictionary.size())) {
    entry = previous + previous.front();
} else {
    throw std::runtime_error("invalid LZW code");
}
```

- [ ] **Step 4: Run the full test command**

Run: `npm run test:code-library`

Expected: chapters 8-10 and all earlier tests PASS.

- [ ] **Step 5: Commit chapters 8-10**

```powershell
git add lib/data-structure-code/chapters/chapter-08.ts lib/data-structure-code/chapters/chapter-09.ts lib/data-structure-code/chapters/chapter-10.ts tests/data-structure-code/chapters-08-10.test.ts
git commit -m "feat: complete stack queue hash and LZW reviews"
```

### Task 7: Complete Chapters 11-15

**Files:**
- Modify: `lib/data-structure-code/chapters/chapter-11.ts`
- Modify: `lib/data-structure-code/chapters/chapter-12.ts`
- Modify: `lib/data-structure-code/chapters/chapter-13.ts`
- Modify: `lib/data-structure-code/chapters/chapter-14.ts`
- Modify: `lib/data-structure-code/chapters/chapter-15.ts`
- Create: `tests/data-structure-code/chapters-11-15.test.ts`

**Interfaces:**
- Consumes: topic IDs for chapters 11-15.
- Produces: tree representations, priority queues, tournament trees, search trees, and balanced search trees.

- [ ] **Step 1: Write the failing required-ID test**

```ts
const required = {
  11: ["array-binary-tree", "linked-binary-tree", "tree-traversal", "iterative-tree-traversals", "tree-level-order", "tree-statistics", "tree-copy-and-equality"],
  12: ["max-heap", "heapify-sort", "leftist-tree-merge", "leftist-priority-queue", "machine-scheduling", "huffman"],
  13: ["winner-tree", "loser-tree", "k-way-merge", "first-fit-packing", "next-fit-packing"],
  14: ["bst", "bst-delete", "duplicate-key-bst", "indexed-bst", "histogram-bst", "best-fit-packing-bst", "cross-distribution"],
  15: ["avl-rotation", "avl-rebalance", "avl-delete", "red-black-insert-fix", "red-black-delete", "splay-tree", "b-tree-search", "b-tree-insert", "b-tree-delete"],
} as const;
```

- [ ] **Step 2: Run and observe missing IDs**

Run: `npm run test:code-library`

Expected: FAIL on the first absent chapter 11-15 ID.

- [ ] **Step 3: Implement tree content with explicit invariants**

AVL and red-black deletion must include rebalancing, not only node removal. B-tree entries must state the chosen minimum degree. Tournament-tree applications must show how one leaf update propagates. Each owning raw-pointer tree must include recursive destruction or use `std::unique_ptr`.

```cpp
void rotateLeft(std::unique_ptr<Node>& root) {
    auto pivot = std::move(root->right);
    root->right = std::move(pivot->left);
    pivot->left = std::move(root);
    root = std::move(pivot);
}
```

- [ ] **Step 4: Run tests and verify tree coverage**

Run: `npm run test:code-library`

Expected: chapter 11-15 required IDs and earlier tests PASS.

- [ ] **Step 5: Commit chapters 11-15**

```powershell
git add lib/data-structure-code/chapters/chapter-11.ts lib/data-structure-code/chapters/chapter-12.ts lib/data-structure-code/chapters/chapter-13.ts lib/data-structure-code/chapters/chapter-14.ts lib/data-structure-code/chapters/chapter-15.ts tests/data-structure-code/chapters-11-15.test.ts
git commit -m "feat: complete tree and priority queue code reviews"
```

### Task 8: Complete Chapters 16-17

**Files:**
- Modify: `lib/data-structure-code/chapters/chapter-16.ts`
- Modify: `lib/data-structure-code/chapters/chapter-17.ts`
- Create: `tests/data-structure-code/chapters-16-17.test.ts`

**Interfaces:**
- Consumes: topic IDs for chapters 16-17.
- Produces: graph representations/operations and the complete greedy-algorithm application set.

- [ ] **Step 1: Write the failing required-ID test**

```ts
const required = {
  16: ["adjacency-matrix-graph", "adjacency-list", "graph-traversal", "graph-path-reconstruction", "connected-components", "dfs-spanning-tree"],
  17: ["greedy-container-loading", "fractional-knapsack", "topological-sort", "binary-covering", "dijkstra", "prim-mst", "kruskal"],
} as const;
```

- [ ] **Step 2: Run and observe missing IDs**

Run: `npm run test:code-library`

Expected: FAIL on missing graph or greedy content.

- [ ] **Step 3: Implement graph and greedy entries**

Graph APIs must define vertex range checks and directed/undirected edge behavior. Dijkstra must reject negative weights. Topological sorting must detect cycles. Prim and Kruskal must report disconnected inputs instead of returning a misleading spanning tree.

```cpp
if (usedEdges != vertexCount - 1)
    throw std::runtime_error("graph is disconnected");
```

- [ ] **Step 4: Run the full content suite**

Run: `npm run test:code-library`

Expected: chapters 16-17 and all earlier tests PASS.

- [ ] **Step 5: Commit chapters 16-17**

```powershell
git add lib/data-structure-code/chapters/chapter-16.ts lib/data-structure-code/chapters/chapter-17.ts tests/data-structure-code/chapters-16-17.test.ts
git commit -m "feat: complete graph and greedy algorithm reviews"
```

### Task 9: Complete Chapters 18-21

**Files:**
- Modify: `lib/data-structure-code/chapters/chapter-18.ts`
- Modify: `lib/data-structure-code/chapters/chapter-19.ts`
- Modify: `lib/data-structure-code/chapters/chapter-20.ts`
- Modify: `lib/data-structure-code/chapters/chapter-21.ts`
- Create: `tests/data-structure-code/chapters-18-21.test.ts`

**Interfaces:**
- Consumes: topic IDs for chapters 18-21.
- Produces: complete divide-and-conquer, dynamic-programming, backtracking, and branch-and-bound applications.

- [ ] **Step 1: Write the failing required-ID test**

```ts
const required = {
  18: ["tromino-board", "merge-sort", "quick-sort", "quickselect", "closest-pair", "recurrence-experiment", "comparison-lower-bound"],
  19: ["knapsack-dp", "matrix-chain-dp", "floyd", "bellman-ford", "noncrossing-subset-dp"],
  20: ["container-loading-backtracking", "backtracking-knapsack", "maximum-clique-backtrack", "tsp-backtrack", "board-arrangement-backtracking"],
  21: ["branch-bound-loading", "best-first-knapsack", "maximum-clique-branch-bound", "tsp-branch-bound", "board-arrangement-branch-bound"],
} as const;
```

- [ ] **Step 2: Run and observe missing IDs**

Run: `npm run test:code-library`

Expected: FAIL on missing chapter 18-21 applications.

- [ ] **Step 3: Implement each algorithm-design application**

Each entry must identify state, transition or branching choice, feasibility rule, bound/pruning rule, and termination condition in `steps` and `invariant`. Backtracking and branch-and-bound versions of the same problem must remain separate and explain their different search orders.

```cpp
struct SearchNode {
    int level;
    int currentWeight;
    int currentValue;
    double upperBound;
    bool operator<(const SearchNode& other) const {
        return upperBound < other.upperBound;
    }
};
```

- [ ] **Step 4: Run every chapter test**

Run: `npm run test:code-library`

Expected: all chapter required-ID tests and earlier tests PASS.

- [ ] **Step 5: Commit chapters 18-21**

```powershell
git add lib/data-structure-code/chapters/chapter-18.ts lib/data-structure-code/chapters/chapter-19.ts lib/data-structure-code/chapters/chapter-20.ts lib/data-structure-code/chapters/chapter-21.ts tests/data-structure-code/chapters-18-21.test.ts
git commit -m "feat: complete algorithm design code reviews"
```

### Task 10: Build the 146-Topic Coverage Manifest

**Files:**
- Create: `lib/data-structure-code/coverage.ts`
- Create: `tests/data-structure-code/coverage.test.ts`
- Modify: `lib/data-structure-code/index.ts`

**Interfaces:**
- Consumes: all chapter code IDs and `DATA_STRUCTURE_CHAPTERS`.
- Produces: `DATA_STRUCTURE_TOPIC_COVERAGE`, `CODE_LIBRARY_STATS`, and a zero-error full validation result.

- [ ] **Step 1: Write the failing coverage test**

```ts
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
```

- [ ] **Step 2: Run and verify coverage exports are missing**

Run: `npm run test:code-library`

Expected: FAIL because coverage exports do not exist.

- [ ] **Step 3: Add an explicit decision for every catalog topic**

Create exactly 146 `TopicCoverage` records. Use `code` for standalone implementations, `experiment` for measured demonstrations, `related` for concepts represented by another implementation, and `theory` only when no meaningful code association exists. Every non-theory record must list real code IDs; every theory record must contain a specific Chinese reason.

```ts
export const DATA_STRUCTURE_TOPIC_COVERAGE: TopicCoverage[] = [
  {
    topicId: "ch01-topic-01",
    chapter: 1,
    topic: "函数与参数",
    status: "code",
    codeIds: ["pass-by-reference"],
  },
  {
    topicId: "ch03-topic-01",
    chapter: 3,
    topic: "大 O 记法",
    status: "related",
    codeIds: ["growth-rate-table", "growth-check"],
  },
];
```

Derive `CODE_LIBRARY_STATS` from arrays instead of hard-coding counts.

- [ ] **Step 4: Run full validation**

Run: `npm run test:code-library`

Expected: coverage count is 146 and `validateCodeLibrary` returns `[]`.

- [ ] **Step 5: Commit the manifest**

```powershell
git add lib/data-structure-code/coverage.ts lib/data-structure-code/index.ts tests/data-structure-code/coverage.test.ts
git commit -m "feat: map all 146 topics to code coverage"
```

### Task 11: Add Testable Filters and Upgrade the Code-Library UI

**Files:**
- Create: `lib/data-structure-code/selectors.ts`
- Create: `tests/data-structure-code/selectors.test.ts`
- Modify: `components/study-workspace.tsx:24,319-355`

**Interfaces:**
- Consumes: `DATA_STRUCTURE_CODE_LIBRARY`, `CODE_LIBRARY_CATEGORIES`, `CODE_LIBRARY_STATS`, and `CodeReviewItem`.
- Produces: `filterCodeItems(items, filters)`, `getVisibleCategories(items, chapter)`, and a mobile-friendly category/filter/detail UI.

- [ ] **Step 1: Write failing selector tests**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { filterCodeItems } from "../../lib/data-structure-code/selectors.ts";
import type { CodeReviewItem } from "../../lib/data-structure-code/types.ts";

test("intersects chapter category priority and keyword", () => {
  const result = filterCodeItems(fixtures, {
    chapter: "6",
    category: "核心操作",
    priority: "必会",
    query: "反转",
  });
  assert.deepEqual(result.map((item) => item.id), ["linked-list-reverse"]);
});

test("searches prerequisites steps and pitfalls", () => {
  assert.equal(filterCodeItems(fixtures, {
    chapter: "all",
    category: "all",
    priority: "all",
    query: "前驱指针",
  }).length, 1);
});

test("all filters restore the full fixture list", () => {
  assert.equal(filterCodeItems(fixtures, {
    chapter: "all",
    category: "all",
    priority: "all",
    query: "",
  }).length, fixtures.length);
});
```

Define `fixtures` in the same test as two complete `CodeReviewItem` objects, including one `linked-list-reverse` item whose steps contain “前驱指针”.

- [ ] **Step 2: Run and verify selector module is missing**

Run: `npm run test:code-library`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `selectors.ts`.

- [ ] **Step 3: Implement selectors and UI**

```ts
export type CodeLibraryFilters = {
  chapter: "all" | string;
  category: "all" | string;
  priority: "all" | CodePriority;
  query: string;
};

export function filterCodeItems(items: CodeReviewItem[], filters: CodeLibraryFilters) {
  const keyword = filters.query.trim().toLocaleLowerCase("zh-CN");
  return items.filter((item) => {
    const text = [item.title, item.category, item.purpose, item.complexity,
      item.invariant, ...item.prerequisites, ...item.steps, ...item.pitfalls]
      .join(" ").toLocaleLowerCase("zh-CN");
    return (filters.chapter === "all" || item.chapter === Number(filters.chapter)) &&
      (filters.category === "all" || item.category === filters.category) &&
      (filters.priority === "all" || item.priority === filters.priority) &&
      (!keyword || text.includes(keyword));
  });
}
```

Update `CodeReviewLibrary` to show topic coverage statistics, category chips for the selected chapter, prerequisites, ordered steps, and the category badge. Keep `<details>` collapsed by default, preserve copy success/failure toasts, and reset category to `all` whenever chapter changes to a chapter that does not contain the current category.

- [ ] **Step 4: Run selector tests and production build**

Run: `npm run test:code-library`

Expected: all tests PASS.

Run: `npm run build:github`

Expected: exit code 0.

- [ ] **Step 5: Manually verify desktop and 390px mobile behavior**

Run: `npm run dev`

Verify in the browser:

- chapter and category strips scroll horizontally;
- long code scrolls inside the code panel without page overflow;
- filters intersect and “清除筛选” restores content;
- cards remain collapsed initially;
- clipboard success works, and browser clipboard denial shows the manual-copy toast;
- console has no new errors.

- [ ] **Step 6: Commit selectors and UI**

```powershell
git add lib/data-structure-code/selectors.ts tests/data-structure-code/selectors.test.ts components/study-workspace.tsx
git commit -m "feat: improve complete code library navigation"
```

### Task 12: Add the Executable Validator and Optional C++ Syntax Checks

**Files:**
- Create: `scripts/validate-data-structure-code.ts`
- Create: `tests/data-structure-code/validator-script.test.ts`
- Modify: `package.json:8-17`

**Interfaces:**
- Consumes: complete library exports and `validateCodeLibrary`.
- Produces: `runCodeLibraryValidation(options): Promise<ValidationReport>` and `npm run validate:code-library`.

- [ ] **Step 1: Write failing compiler-detection tests**

```ts
test("structural validation succeeds and reports skipped C++ checks without a compiler", async () => {
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
});
```

- [ ] **Step 2: Run and verify the validator script export is missing**

Run: `npm run test:code-library`

Expected: FAIL importing `runCodeLibraryValidation`.

- [ ] **Step 3: Implement structural and compiler validation**

The script must run structural checks unconditionally. Detect `g++`, `clang++`, or `cl` in that order. For GNU/Clang, write one temporary `.cpp` per item and run `-std=c++17 -fsyntax-only`; for MSVC run `/std:c++17 /Zs`. Delete only the script-created temporary directory in a `finally` block. Return `skipped` with a clear message when no compiler exists.

```ts
export type ValidationReport = {
  structuralErrors: string[];
  cpp: { status: "passed" | "failed" | "skipped"; errors: string[]; compiler?: string };
};

export type ValidationOptions = {
  findCompiler: () => Promise<string | null>;
  compile: (id: string, code: string, compiler: string) => Promise<string | null>;
};
```

Export `runCodeLibraryValidation(options?: Partial<ValidationOptions>)`. Guard the command-line entry point so importing the function in tests does not start validation; only direct execution prints the report and sets `process.exitCode`.

Add scripts:

```json
"validate:code-library": "node --experimental-strip-types scripts/validate-data-structure-code.ts",
"verify:code-library": "npm run test:code-library && npm run validate:code-library && npm run build:github"
```

- [ ] **Step 4: Run the complete validator**

Run: `npm run verify:code-library`

Expected: structure and tests pass; C++ status is either `passed` or an explicit `skipped: no C++ compiler found`; Vite build exits 0.

- [ ] **Step 5: Commit executable validation**

```powershell
git add scripts/validate-data-structure-code.ts tests/data-structure-code/validator-script.test.ts package.json
git commit -m "test: validate complete data structure code library"
```

### Task 13: Final Verification, Documentation, and GitHub Pages Publication

**Files:**
- Modify: `README.md`
- Modify: `.planning/2026-09-20-complete-data-structure-code-library/task_plan.md` and `progress.md` (ignored working records only)

**Interfaces:**
- Consumes: all previous deliverables.
- Produces: verified documentation, a published commit, and evidence that GitHub Pages serves the new library.

- [ ] **Step 1: Document the new code library**

Add a Chinese README section stating: 21 chapters; 146 accounted topics; actual code-topic count read from the UI rather than hard-coded in prose; chapter/category/search/priority browsing; original C++17 content; no online execution.

- [ ] **Step 2: Run fresh complete verification**

Run: `npm run verify:code-library`

Expected: tests and structural validation pass, the C++ status is reported truthfully, and the production build exits 0.

Run: `npx tsc --noEmit`

Expected: either exit 0 or only the already documented unrelated API response/mastery-route errors. Any error under `lib/data-structure-code`, its tests, the validator, or the updated code-library UI must be fixed before continuing.

Run: `git diff --check`

Expected: no whitespace errors.

- [ ] **Step 3: Repeat visual QA against the production preview**

Serve `github-pages-dist`, then inspect desktop and 390x844 mobile layouts. Verify chapter/category filters, search, collapse, copy, empty state, long-code overflow, accurate 146-topic statistics, and an empty browser console error list.

- [ ] **Step 4: Commit final documentation**

```powershell
git add README.md
git commit -m "docs: describe complete data structure code library"
```

- [ ] **Step 5: Push and verify public assets**

Run: `git push github master:main`

Fetch `https://vakasu11.github.io/zhixu-learning/`, then fetch its referenced JavaScript asset. Confirm HTTP 200 and the presence of the new coverage text, category-navigation label, and the computed code-topic count. If GitHub Pages still serves the old asset, wait for the deployment and retry with bounded checks; do not claim publication until the new asset is observed.

- [ ] **Step 6: Close the persistent task plan**

Mark implementation, testing, and delivery phases complete only after public verification. Record the final commit, code-topic count, coverage count, test totals, compiler-check status, build status, mobile QA status, and public URL in `progress.md`.
