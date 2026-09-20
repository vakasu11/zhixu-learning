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
    "code": "template<class T>\nint sequentialSearch(const T a[], int n, const T& target) {\n    for (int i = 0; i < n; ++i)\n        if (a[i] == target) return i;\n    return -1;\n}",
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
    "code": "void insertionSort(vector<int>& a) {\n    for (int i = 1; i < (int)a.size(); ++i) {\n        int key = a[i], j = i - 1;\n        while (j >= 0 && a[j] > key) {\n            a[j + 1] = a[j];\n            --j;\n        }\n        a[j + 1] = key;\n    }\n}",
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
    "code": "void bubbleSort(vector<int>& a) {\n    for (int end = (int)a.size() - 1; end > 0; --end) {\n        bool changed = false;\n        for (int i = 0; i < end; ++i) {\n            if (a[i] > a[i + 1]) {\n                swap(a[i], a[i + 1]);\n                changed = true;\n            }\n        }\n        if (!changed) break;\n    }\n}",
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
  }
];
