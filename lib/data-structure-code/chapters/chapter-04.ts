import type { CodeReviewItem } from "../types.ts";

export const chapter04Code: CodeReviewItem[] = [
  {
    "id": "benchmark",
    "chapter": 4,
    "title": "性能测量：重复运行与数据复原",
    "priority": "重点理解",
    "purpose": "正确测量算法时间，排除数据生成、输出与单次抖动。",
    "complexity": "测量成本约为重复次数乘以被测算法成本。",
    "invariant": "每轮算法获得相同规模、同分布的独立输入。",
    "pitfalls": [
      "计时范围不要包含输出",
      "一次运行太短不可靠",
      "比较时使用相同编译模式"
    ],
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\ntemplate<class F>\ndouble benchmark(F algorithm, const vector<int>& source, int repeat) {\n    using Clock = chrono::steady_clock;\n    auto start = Clock::now();\n    for (int r = 0; r < repeat; ++r) {\n        auto data = source;\n        algorithm(data);\n    }\n    auto stop = Clock::now();\n    return chrono::duration<double, milli>(stop - start).count() / repeat;\n}",
    "category": "性能实验",
    "topicIds": [
      "ch04-topic-03"
    ],
    "prerequisites": [
      "实验设计",
      "C++17 基础语法"
    ],
    "steps": [
      "根据输入建立“实验设计”所需的初始状态",
      "按不变式执行“性能测量：重复运行与数据复原”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "实验设计",
      "pdfPages": "PDF第98-108页（书中第81-91页）"
    }
  },
  {
    "id": "cache-loop-order",
    "chapter": 4,
    "title": "矩阵遍历：循环次序与高速缓存",
    "priority": "必会",
    "purpose": "通过连续访问行元素减少缓存未命中，理解实验结果为何受存储布局影响。",
    "complexity": "两种写法均为 Θ(rows·cols)，常数差异显著。",
    "invariant": "行优先存储下，内层循环沿连续地址前进。",
    "pitfalls": [
      "复杂度相同不等于运行时间相同",
      "测试前应预热并重复运行"
    ],
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nlong long rowMajorSum(const vector<vector<int>>& a) {\n    long long sum = 0;\n    for (int i = 0; i < (int)a.size(); ++i)\n        for (int j = 0; j < (int)a[i].size(); ++j)\n            sum += a[i][j];\n    return sum;\n}",
    "category": "性能实验",
    "topicIds": [
      "ch04-topic-04"
    ],
    "prerequisites": [
      "高速缓存影响",
      "C++17 基础语法"
    ],
    "steps": [
      "根据输入建立“高速缓存影响”所需的初始状态",
      "按不变式执行“矩阵遍历：循环次序与高速缓存”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "高速缓存影响",
      "pdfPages": "PDF第98-108页（书中第81-91页）"
    }
  },
  {
    "id": "benchmark-statistics",
    "chapter": 4,
    "title": "性能实验：中位数计时",
    "priority": "重点理解",
    "purpose": "多次采样并取中位数，降低系统调度和偶发抖动的影响。",
    "complexity": "r 次实验外加 O(r log r) 的样本排序。",
    "invariant": "所有样本使用相同规模与相同实验步骤。",
    "pitfalls": [
      "不要只报告最快一次",
      "计时前后避免输出",
      "记录编译器优化级别"
    ],
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nconst int runs = 9;\nvector<double> samples;\nfor (int r = 0; r < runs; ++r)\n    samples.push_back(runOnce());\nsort(samples.begin(), samples.end());\ndouble median = samples[samples.size() / 2];",
    "category": "性能实验",
    "topicIds": [
      "ch04-topic-03"
    ],
    "prerequisites": [
      "实验设计",
      "C++17 基础语法"
    ],
    "steps": [
      "根据输入建立“实验设计”所需的初始状态",
      "按不变式执行“性能实验：中位数计时”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "实验设计",
      "pdfPages": "PDF第98-108页（书中第81-91页）"
    }
  },
  {
    "id": "matrix-multiply-loop-orders",
    "chapter": 4,
    "category": "性能实验",
    "title": "矩阵乘法：比较循环次序",
    "priority": "必会",
    "topicIds": [
      "ch04-topic-01"
    ],
    "prerequisites": [
      "实例规模选择",
      "C++17 基础语法"
    ],
    "purpose": "掌握矩阵乘法：比较循环次序的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“实例规模选择”的输入与状态",
      "执行矩阵乘法：比较循环次序的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“实例规模选择”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "实例规模选择",
      "pdfPages": "PDF第98-108页（书中第81-91页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nusing Matrix = vector<vector<double>>;\nMatrix multiplyIKJ(const Matrix& a, const Matrix& b) {\n    Matrix c(a.size(), vector<double>(b[0].size()));\n    for (size_t i=0;i<a.size();++i) for(size_t k=0;k<b.size();++k) for(size_t j=0;j<b[0].size();++j) c[i][j]+=a[i][k]*b[k][j];\n    return c;\n}"
  },
  {
    "id": "repeatable-data-generator",
    "chapter": 4,
    "category": "性能实验",
    "title": "可重复测试数据：固定种子的随机数",
    "priority": "必会",
    "topicIds": [
      "ch04-topic-02"
    ],
    "prerequisites": [
      "测试数据设计",
      "C++17 基础语法"
    ],
    "purpose": "掌握可重复测试数据：固定种子的随机数的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“测试数据设计”的输入与状态",
      "执行可重复测试数据：固定种子的随机数的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“测试数据设计”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "测试数据设计",
      "pdfPages": "PDF第98-108页（书中第81-91页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nvector<int> repeatableData(size_t n, uint32_t seed = 20260920) {\n    mt19937 engine(seed); uniform_int_distribution<int> pick(-100000, 100000);\n    vector<int> values(n); generate(values.begin(), values.end(), [&] { return pick(engine); }); return values;\n}"
  }
];
