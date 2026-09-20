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
    "code": "int binarySearch(const vector<int>& a, int target) {\n    int left = 0, right = (int)a.size() - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (a[mid] == target) return mid;\n        if (a[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}",
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
    "code": "double horner(const vector<double>& coefficient, double x) {\n    double result = 0;\n    for (double c : coefficient) result = result * x + c;\n    return result;\n}",
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
    "code": "for (int n = 1024; n <= 1 << 20; n *= 2) {\n    auto data = makeInput(n, fixedSeed);\n    double time = benchmark(algorithm, data, repetitions);\n    cout << n << ' ' << time << '\\n';\n}",
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
  }
];
