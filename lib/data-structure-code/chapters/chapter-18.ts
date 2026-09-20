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
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nvoid mergeSort(vector<int>& a, int left, int right, vector<int>& tmp) {\n    if (right - left <= 1) return;\n    int mid = left + (right - left) / 2;\n    mergeSort(a, left, mid, tmp); mergeSort(a, mid, right, tmp);\n    int i = left, j = mid, k = left;\n    while (i < mid && j < right) tmp[k++] = a[i] <= a[j] ? a[i++] : a[j++];\n    while (i < mid) tmp[k++] = a[i++];\n    while (j < right) tmp[k++] = a[j++];\n    copy(tmp.begin() + left, tmp.begin() + right, a.begin() + left);\n}",
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
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nint partition(vector<int>& a, int left, int right) {\n    int pivot = a[right], i = left;\n    for (int j = left; j < right; ++j)\n        if (a[j] <= pivot) swap(a[i++], a[j]);\n    swap(a[i], a[right]);\n    return i;\n}\n\nvoid quickSort(vector<int>& a, int left, int right) {\n    if (left >= right) return;\n    int p = partition(a, left, right);\n    quickSort(a, left, p - 1);\n    quickSort(a, p + 1, right);\n}",
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
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nint quickSelect(vector<int>& a, int left, int right, int k) {\n    while (left <= right) {\n        int p = partition(a, left, right);\n        if (p == k) return a[p];\n        if (k < p) right = p - 1;\n        else left = p + 1;\n    }\n    throw out_of_range(\"rank\");\n}",
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
  },
  {
    "id": "tromino-board",
    "chapter": 18,
    "category": "分治算法",
    "title": "棋盘覆盖：递归放置 L 形骨牌",
    "priority": "必会",
    "topicIds": [
      "ch18-topic-01"
    ],
    "prerequisites": [
      "分治算法思想",
      "对应章节的数据结构"
    ],
    "purpose": "掌握棋盘覆盖：递归放置 L 形骨牌的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“分治算法思想”的输入与状态",
      "执行棋盘覆盖：递归放置 L 形骨牌的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“分治算法思想”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "分治算法思想",
      "pdfPages": "PDF第463-495页（书中第446-478页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nvoid coverBoard(vector<vector<int>>&board,int top,int left,int missingRow,int missingCol,int size,int&tile){if(size==1)return;int half=size/2,current=tile++;int centerRow=top+half-1,centerCol=left+half-1;array<pair<int,int>,4>centers={pair{centerRow,centerCol},pair{centerRow,centerCol+1},pair{centerRow+1,centerCol},pair{centerRow+1,centerCol+1}};int quadrant=(missingRow>=top+half)*2+(missingCol>=left+half);for(int q=0;q<4;++q)if(q!=quadrant)board[centers[q].first][centers[q].second]=current;}"
  },
  {
    "id": "closest-pair",
    "chapter": 18,
    "category": "分治算法",
    "title": "最近点对：按横坐标分治",
    "priority": "必会",
    "topicIds": [
      "ch18-topic-02"
    ],
    "prerequisites": [
      "线路棋盘",
      "对应章节的数据结构"
    ],
    "purpose": "掌握最近点对：按横坐标分治的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“线路棋盘”的输入与状态",
      "执行最近点对：按横坐标分治的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“线路棋盘”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "线路棋盘",
      "pdfPages": "PDF第463-495页（书中第446-478页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nstruct P{double x,y;};double distance(P a,P b){return hypot(a.x-b.x,a.y-b.y);}double closestPair(vector<P>points){sort(points.begin(),points.end(),[](P a,P b){return a.x<b.x;});double best=numeric_limits<double>::infinity();for(size_t i=0;i<points.size();++i)for(size_t j=i+1;j<points.size()&&points[j].x-points[i].x<best;++j)best=min(best,distance(points[i],points[j]));return best;}"
  },
  {
    "id": "recurrence-experiment",
    "chapter": 18,
    "category": "分治算法",
    "title": "递归方程：实测调用规模",
    "priority": "必会",
    "topicIds": [
      "ch18-topic-03"
    ],
    "prerequisites": [
      "归并排序",
      "对应章节的数据结构"
    ],
    "purpose": "掌握递归方程：实测调用规模的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“归并排序”的输入与状态",
      "执行递归方程：实测调用规模的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“归并排序”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "归并排序",
      "pdfPages": "PDF第463-495页（书中第446-478页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nsize_t mergeRecurrence(size_t n){if(n<=1)return 1;return n+mergeRecurrence(n/2)+mergeRecurrence(n-n/2);}"
  },
  {
    "id": "comparison-lower-bound",
    "chapter": 18,
    "category": "分治算法",
    "title": "比较排序下界：计算 log2(n!)",
    "priority": "重点理解",
    "topicIds": [
      "ch18-topic-04"
    ],
    "prerequisites": [
      "快速排序",
      "对应章节的数据结构"
    ],
    "purpose": "掌握比较排序下界：计算 log2(n!)的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“快速排序”的输入与状态",
      "执行比较排序下界：计算 log2(n!)的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“快速排序”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "快速排序",
      "pdfPages": "PDF第463-495页（书中第446-478页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\ndouble comparisonLowerBound(size_t n){double bits=0;for(size_t i=2;i<=n;++i)bits+=log2(double(i));return ceil(bits);}"
  }
];
