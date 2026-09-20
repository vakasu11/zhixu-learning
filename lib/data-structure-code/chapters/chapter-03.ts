import type { CodeReviewItem } from "../types.ts";

export const chapter03Code: CodeReviewItem[] = [
  {
    "id": "binary-search",
    "chapter": 3,
    "title": "二分查找与闭区间边界",
    "priority": "必会",
    "purpose": "掌握 O(log n) 的典型来源，并训练不越界的边界收缩。",
    "complexity": "时间 O(log n)，额外空间 O(1)。",
    "invariant": "若目标存在，它始终在闭区间 [left, right] 内。",
    "pitfalls": [
      "只适用于有序序列",
      "更新边界必须越过 mid",
      "中点写法避免溢出"
    ],
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nint binarySearch(const vector<int>& a, int target) {\n    int left = 0, right = (int)a.size() - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (a[mid] == target) return mid;\n        if (a[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}",
    "category": "渐近分析",
    "topicIds": [
      "ch03-topic-05"
    ],
    "prerequisites": [
      "复杂度分析",
      "C++17 基础语法"
    ],
    "steps": [
      "根据输入建立“复杂度分析”所需的初始状态",
      "按不变式执行“二分查找与闭区间边界”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "复杂度分析",
      "pdfPages": "PDF第81-97页（书中第64-80页）"
    }
  },
  {
    "id": "horner",
    "chapter": 3,
    "title": "霍纳法：把多项式降为线性复杂度",
    "priority": "必会",
    "purpose": "用同一个计算任务对比 O(n²) 与 Θ(n) 的算法设计。",
    "complexity": "时间 Θ(n)，额外空间 O(1)。",
    "invariant": "处理到系数 i 时，result 表示已处理前缀对应的嵌套多项式值。",
    "pitfalls": [
      "系数顺序必须明确",
      "不要重复计算 x 的幂"
    ],
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\ndouble horner(const vector<double>& coefficient, double x) {\n    double result = 0;\n    for (double c : coefficient) result = result * x + c;\n    return result;\n}",
    "category": "渐近分析",
    "topicIds": [
      "ch03-topic-05"
    ],
    "prerequisites": [
      "复杂度分析",
      "C++17 基础语法"
    ],
    "steps": [
      "根据输入建立“复杂度分析”所需的初始状态",
      "按不变式执行“霍纳法：把多项式降为线性复杂度”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "复杂度分析",
      "pdfPages": "PDF第81-97页（书中第64-80页）"
    }
  },
  {
    "id": "growth-check",
    "chapter": 3,
    "title": "经验增长率：倍增规模估算阶数",
    "priority": "重点理解",
    "purpose": "用 T(2n)/T(n) 的变化辅助判断线性、平方或对数增长。",
    "complexity": "取决于被测算法；记录本身 O(k)。",
    "invariant": "每次只改变输入规模，数据分布和运行环境保持一致。",
    "pitfalls": [
      "经验测量不能代替数学证明",
      "输入过小会受固定开销影响"
    ],
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nfor (int n = 1024; n <= 1 << 20; n *= 2) {\n    auto data = makeInput(n, fixedSeed);\n    double time = benchmark(algorithm, data, repetitions);\n    cout << n << ' ' << time << '\\n';\n}",
    "category": "渐近分析",
    "topicIds": [
      "ch03-topic-06"
    ],
    "prerequisites": [
      "实际复杂度",
      "C++17 基础语法"
    ],
    "steps": [
      "根据输入建立“实际复杂度”所需的初始状态",
      "按不变式执行“经验增长率：倍增规模估算阶数”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "实际复杂度",
      "pdfPages": "PDF第81-97页（书中第64-80页）"
    }
  },
  {
    "id": "growth-rate-table",
    "chapter": 3,
    "category": "渐近分析",
    "title": "增长率表：比较常见复杂度函数",
    "priority": "必会",
    "topicIds": [
      "ch03-topic-01"
    ],
    "prerequisites": [
      "大 O 记法",
      "C++17 基础语法"
    ],
    "purpose": "掌握增长率表：比较常见复杂度函数的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“大 O 记法”的输入与状态",
      "执行增长率表：比较常见复杂度函数的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“大 O 记法”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "大 O 记法",
      "pdfPages": "PDF第81-97页（书中第64-80页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nvector<array<double, 4>> growthTable(const vector<double>& sizes) {\n    vector<array<double, 4>> rows;\n    for (double n : sizes) rows.push_back({log2(max(1.0, n)), n, n * log2(max(1.0, n)), n * n});\n    return rows;\n}"
  },
  {
    "id": "recurrence-call-counter",
    "chapter": 3,
    "category": "渐近分析",
    "title": "递归方程实验：统计递归调用",
    "priority": "必会",
    "topicIds": [
      "ch03-topic-02"
    ],
    "prerequisites": [
      "Ω 记法",
      "C++17 基础语法"
    ],
    "purpose": "掌握递归方程实验：统计递归调用的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“Ω 记法”的输入与状态",
      "执行递归方程实验：统计递归调用的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“Ω 记法”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "Ω 记法",
      "pdfPages": "PDF第81-97页（书中第64-80页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nsize_t fibonacciCalls(int n) {\n    if (n <= 1) return 1;\n    return 1 + fibonacciCalls(n - 1) + fibonacciCalls(n - 2);\n}"
  }
];
