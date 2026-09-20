import type { CodeReviewItem } from "../types.ts";

export const chapter18Code: CodeReviewItem[] = [
  {
    "id": "merge-sort",
    "chapter": 18,
    "title": "归并排序",
    "priority": "必会",
    "purpose": "分成两半分别排序，再线性合并两个有序段。",
    "complexity": "时间 O(n log n)，辅助空间 O(n)，稳定。",
    "invariant": "tmp 始终是两个有序前缀的有序合并。",
    "pitfalls": [
      "出口是区间长度不超过 1",
      "相等时先取左边保持稳定"
    ],
    "code": "void mergeSort(vector<int>& a, int left, int right, vector<int>& tmp) {\n    if (right - left <= 1) return;\n    int mid = left + (right - left) / 2;\n    mergeSort(a, left, mid, tmp); mergeSort(a, mid, right, tmp);\n    int i = left, j = mid, k = left;\n    while (i < mid && j < right) tmp[k++] = a[i] <= a[j] ? a[i++] : a[j++];\n    while (i < mid) tmp[k++] = a[i++];\n    while (j < right) tmp[k++] = a[j++];\n    copy(tmp.begin() + left, tmp.begin() + right, a.begin() + left);\n}",
    "category": "分治算法",
    "topicIds": [
      "ch18-topic-03"
    ],
    "prerequisites": [
      "归并排序",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“归并排序”所需的初始状态",
      "按不变式执行“归并排序”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "归并排序",
      "pdfPages": "PDF第463-495页（书中第446-478页）"
    }
  },
  {
    "id": "quick-sort",
    "chapter": 18,
    "title": "快速排序：分区",
    "priority": "必会",
    "purpose": "围绕基准划分两侧，再递归处理子区间。",
    "complexity": "平均 O(n log n)，最坏 O(n²)。",
    "invariant": "扫描中 [left,i) 不大于基准，[i,j) 大于基准。",
    "pitfalls": [
      "边界约定保持一致",
      "随机基准降低退化概率",
      "普通快排不稳定"
    ],
    "code": "int partition(vector<int>& a, int left, int right) {\n    int pivot = a[right], i = left;\n    for (int j = left; j < right; ++j)\n        if (a[j] <= pivot) swap(a[i++], a[j]);\n    swap(a[i], a[right]);\n    return i;\n}\n\nvoid quickSort(vector<int>& a, int left, int right) {\n    if (left >= right) return;\n    int p = partition(a, left, right);\n    quickSort(a, left, p - 1);\n    quickSort(a, p + 1, right);\n}",
    "category": "分治算法",
    "topicIds": [
      "ch18-topic-04"
    ],
    "prerequisites": [
      "快速排序",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“快速排序”所需的初始状态",
      "按不变式执行“快速排序：分区”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "快速排序",
      "pdfPages": "PDF第463-495页（书中第446-478页）"
    }
  },
  {
    "id": "quickselect",
    "chapter": 18,
    "title": "快速选择：第 k 小元素",
    "priority": "必会",
    "purpose": "只递归进入包含目标排名的一侧，避免完整排序。",
    "complexity": "期望 O(n)，最坏 O(n²)。",
    "invariant": "每次分区后，基准已经位于最终排名位置。",
    "pitfalls": [
      "k 是下标还是第几个要统一",
      "随机选择基准降低退化风险"
    ],
    "code": "int quickSelect(vector<int>& a, int left, int right, int k) {\n    while (left <= right) {\n        int p = partition(a, left, right);\n        if (p == k) return a[p];\n        if (k < p) right = p - 1;\n        else left = p + 1;\n    }\n    throw out_of_range(\"rank\");\n}",
    "category": "分治算法",
    "topicIds": [
      "ch18-topic-05"
    ],
    "prerequisites": [
      "选择问题",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“选择问题”所需的初始状态",
      "按不变式执行“快速选择：第 k 小元素”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "选择问题",
      "pdfPages": "PDF第463-495页（书中第446-478页）"
    }
  }
];
