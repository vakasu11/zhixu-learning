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
    "code": "template<class F>\ndouble benchmark(F algorithm, const vector<int>& source, int repeat) {\n    using Clock = chrono::steady_clock;\n    auto start = Clock::now();\n    for (int r = 0; r < repeat; ++r) {\n        auto data = source;\n        algorithm(data);\n    }\n    auto stop = Clock::now();\n    return chrono::duration<double, milli>(stop - start).count() / repeat;\n}",
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
    "code": "long long rowMajorSum(const vector<vector<int>>& a) {\n    long long sum = 0;\n    for (int i = 0; i < (int)a.size(); ++i)\n        for (int j = 0; j < (int)a[i].size(); ++j)\n            sum += a[i][j];\n    return sum;\n}",
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
    "code": "const int runs = 9;\nvector<double> samples;\nfor (int r = 0; r < runs; ++r)\n    samples.push_back(runOnce());\nsort(samples.begin(), samples.end());\ndouble median = samples[samples.size() / 2];",
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
  }
];
