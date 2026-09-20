import type { CodeReviewItem } from "../types.ts";

export const chapter02Code: CodeReviewItem[] = [
  {
    "id": "sequential-search",
    "chapter": 2,
    "title": "顺序查找与操作计数",
    "priority": "必会",
    "purpose": "把循环次数与输入规模联系起来，理解最好、最坏和平均复杂度。",
    "complexity": "最好 O(1)，最坏 O(n)，平均 O(n)。",
    "invariant": "进入第 i 次比较前，[0, i) 中不存在目标。",
    "pitfalls": [
      "先约定失败返回值",
      "平均比较次数不是常数"
    ],
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\ntemplate<class T>\nint sequentialSearch(const T a[], int n, const T& target) {\n    for (int i = 0; i < n; ++i)\n        if (a[i] == target) return i;\n    return -1;\n}",
    "category": "复杂度分析",
    "topicIds": [
      "ch02-topic-04"
    ],
    "prerequisites": [
      "操作计数",
      "C++17 基础语法"
    ],
    "steps": [
      "根据输入建立“操作计数”所需的初始状态",
      "按不变式执行“顺序查找与操作计数”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "操作计数",
      "pdfPages": "PDF第55-80页（书中第38-63页）"
    }
  },
  {
    "id": "insertion-sort",
    "chapter": 2,
    "title": "插入排序：维护有序前缀",
    "priority": "必会",
    "purpose": "对比移动与交换，理解基础排序的循环不变量。",
    "complexity": "最好 O(n)，最坏 O(n²)，原地且稳定。",
    "invariant": "每轮开始时 a[0..i) 已有序。",
    "pitfalls": [
      "移动结束后才放回 key",
      "比较应使用严格大于以保持稳定"
    ],
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nvoid insertionSort(vector<int>& a) {\n    for (int i = 1; i < (int)a.size(); ++i) {\n        int key = a[i], j = i - 1;\n        while (j >= 0 && a[j] > key) {\n            a[j + 1] = a[j];\n            --j;\n        }\n        a[j + 1] = key;\n    }\n}",
    "category": "复杂度分析",
    "topicIds": [
      "ch02-topic-04"
    ],
    "prerequisites": [
      "操作计数",
      "C++17 基础语法"
    ],
    "steps": [
      "根据输入建立“操作计数”所需的初始状态",
      "按不变式执行“插入排序：维护有序前缀”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "操作计数",
      "pdfPages": "PDF第55-80页（书中第38-63页）"
    }
  },
  {
    "id": "bubble-sort",
    "chapter": 2,
    "title": "改进冒泡排序：提前结束",
    "priority": "必会",
    "purpose": "理解一次扫描如何把最大元素送到末尾，并利用交换标志识别已有序。",
    "complexity": "最好 O(n)，最坏 O(n²)，原地且稳定。",
    "invariant": "第 i 轮结束后，末尾 i 个元素已在最终位置。",
    "pitfalls": [
      "内层只比较到 n-1-i",
      "整轮无交换即可结束"
    ],
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nvoid bubbleSort(vector<int>& a) {\n    for (int end = (int)a.size() - 1; end > 0; --end) {\n        bool changed = false;\n        for (int i = 0; i < end; ++i) {\n            if (a[i] > a[i + 1]) {\n                swap(a[i], a[i + 1]);\n                changed = true;\n            }\n        }\n        if (!changed) break;\n    }\n}",
    "category": "复杂度分析",
    "topicIds": [
      "ch02-topic-04"
    ],
    "prerequisites": [
      "操作计数",
      "C++17 基础语法"
    ],
    "steps": [
      "根据输入建立“操作计数”所需的初始状态",
      "按不变式执行“改进冒泡排序：提前结束”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "操作计数",
      "pdfPages": "PDF第55-80页（书中第38-63页）"
    }
  },
  {
    "id": "recursive-space-count",
    "chapter": 2,
    "category": "复杂度分析",
    "title": "递归空间计数：观察调用栈深度",
    "priority": "必会",
    "topicIds": [
      "ch02-topic-01"
    ],
    "prerequisites": [
      "程序性能",
      "C++17 基础语法"
    ],
    "purpose": "掌握递归空间计数：观察调用栈深度的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“程序性能”的输入与状态",
      "执行递归空间计数：观察调用栈深度的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“程序性能”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "程序性能",
      "pdfPages": "PDF第55-80页（书中第38-63页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nsize_t maximumDepth(size_t n, size_t depth = 1) {\n    return n == 0 ? depth : maximumDepth(n - 1, depth + 1);\n}"
  },
  {
    "id": "operation-counting",
    "chapter": 2,
    "category": "复杂度分析",
    "title": "操作计数：验证三角循环",
    "priority": "必会",
    "topicIds": [
      "ch02-topic-02"
    ],
    "prerequisites": [
      "空间复杂度",
      "C++17 基础语法"
    ],
    "purpose": "掌握操作计数：验证三角循环的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“空间复杂度”的输入与状态",
      "执行操作计数：验证三角循环的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“空间复杂度”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "空间复杂度",
      "pdfPages": "PDF第55-80页（书中第38-63页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nsize_t triangularOperations(size_t n) {\n    size_t count = 0;\n    for (size_t i = 0; i < n; ++i) for (size_t j = 0; j < i; ++j) ++count;\n    return count;\n}"
  },
  {
    "id": "best-average-worst-inputs",
    "chapter": 2,
    "category": "复杂度分析",
    "title": "最好、平均与最坏输入：顺序查找实验",
    "priority": "必会",
    "topicIds": [
      "ch02-topic-03"
    ],
    "prerequisites": [
      "时间复杂度",
      "C++17 基础语法"
    ],
    "purpose": "掌握最好、平均与最坏输入：顺序查找实验的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“时间复杂度”的输入与状态",
      "执行最好、平均与最坏输入：顺序查找实验的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“时间复杂度”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "时间复杂度",
      "pdfPages": "PDF第55-80页（书中第38-63页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nsize_t comparisons(const vector<int>& values, int key) {\n    size_t count = 0;\n    for (int value : values) { ++count; if (value == key) break; }\n    return count;\n}"
  }
];
