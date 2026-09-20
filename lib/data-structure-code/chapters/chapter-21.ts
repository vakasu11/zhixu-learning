import type { CodeReviewItem } from "../types.ts";

export const chapter21Code: CodeReviewItem[] = [
  {
    "id": "branch-bound-loading",
    "chapter": 21,
    "title": "货箱装载：分支定界骨架",
    "priority": "重点理解",
    "purpose": "显式保存活节点，并用上界淘汰不可能更优的分支。",
    "complexity": "最坏 O(2^n)，好界函数可大幅减少扩展。",
    "invariant": "优先队列只保留仍可能超过 best 的活节点。",
    "pitfalls": [
      "结点要包含层数、当前值和上界",
      "优先队列按上界排序",
      "与递归回溯的活节点管理不同"
    ],
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nstruct State { int level, weight, bound; };\nauto cmp = [](const State& a, const State& b){ return a.bound < b.bound; };\npriority_queue<State, vector<State>, decltype(cmp)> live(cmp);\nlive.push({0, 0, totalWeight});\n\nwhile (!live.empty()) {\n    State x = live.top(); live.pop();\n    if (x.bound <= best || x.level == n) continue;\n    int i = x.level;\n    if (x.weight + w[i] <= capacity) {\n        best = max(best, x.weight + w[i]);\n        live.push({i + 1, x.weight + w[i], x.bound});\n    }\n    int withoutBound = x.bound - w[i];\n    if (withoutBound > best) live.push({i + 1, x.weight, withoutBound});\n}",
    "category": "分支定界",
    "topicIds": [
      "ch21-topic-02"
    ],
    "prerequisites": [
      "货箱装载—分支定界",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“货箱装载—分支定界”所需的初始状态",
      "按不变式执行“货箱装载：分支定界骨架”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "货箱装载—分支定界",
      "pdfPages": "PDF第542-561页（书中第525-544页）"
    }
  },
  {
    "id": "best-first-knapsack",
    "chapter": 21,
    "title": "0/1 背包：最佳优先分支定界",
    "priority": "重点理解",
    "purpose": "按价值上界扩展最有希望的活节点，尽早找到高质量可行解。",
    "complexity": "最坏 O(2^n)，通常依赖界函数显著剪枝。",
    "invariant": "堆顶具有当前所有活节点中最大的乐观价值上界。",
    "pitfalls": [
      "分数背包只能用于计算上界",
      "上界不超过 best 的节点直接舍弃",
      "结点需记录层数、重量和价值"
    ],
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nstruct BoundNode { int level, weight, value; double bound; };\npriority_queue<BoundNode, vector<BoundNode>, ByBound> live;\nlive.push(rootNode());\n\nwhile (!live.empty()) {\n    auto node = live.top(); live.pop();\n    if (node.bound <= bestValue || node.level == n) continue;\n    for (auto child : expandTakeOrSkip(node)) {\n        if (child.weight <= capacity) bestValue = max(bestValue, child.value);\n        child.bound = fractionalUpperBound(child);\n        if (child.bound > bestValue) live.push(child);\n    }\n}",
    "category": "分支定界",
    "topicIds": [
      "ch21-topic-03"
    ],
    "prerequisites": [
      "0/1 背包—分支定界",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“0/1 背包—分支定界”所需的初始状态",
      "按不变式执行“0/1 背包：最佳优先分支定界”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "0/1 背包—分支定界",
      "pdfPages": "PDF第542-561页（书中第525-544页）"
    }
  },
  {
    "id": "tsp-branch-bound",
    "chapter": 21,
    "title": "旅行商问题：最小堆分支定界",
    "priority": "重点理解",
    "purpose": "用部分回路的代价下界决定下一步扩展哪个排列节点。",
    "complexity": "最坏 O(n!)，下界越紧扩展越少。",
    "invariant": "最小堆按乐观总成本下界排序，完整回路提供当前上界。",
    "pitfalls": [
      "下界必须不大于该节点任何完整解成本",
      "出堆下界不小于 best 时可终止",
      "避免重复城市"
    ],
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\npriority_queue<TspNode, vector<TspNode>, ByLowerBound> live;\nlive.push(makeRoot());\n\nwhile (!live.empty()) {\n    TspNode node = live.top(); live.pop();\n    if (node.lowerBound >= bestCost) continue;\n    if (node.path.size() == n) {\n        bestCost = min(bestCost, closeTour(node));\n        continue;\n    }\n    for (int city : unvisitedCities(node)) {\n        TspNode child = appendCity(node, city);\n        child.lowerBound = computeLowerBound(child);\n        if (child.lowerBound < bestCost) live.push(child);\n    }\n}",
    "category": "分支定界",
    "topicIds": [
      "ch21-topic-05"
    ],
    "prerequisites": [
      "旅行商问题—分支定界",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“旅行商问题—分支定界”所需的初始状态",
      "按不变式执行“旅行商问题：最小堆分支定界”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "旅行商问题—分支定界",
      "pdfPages": "PDF第542-561页（书中第525-544页）"
    }
  },
  {
    "id": "maximum-clique-branch-bound",
    "chapter": 21,
    "category": "分支定界",
    "title": "最大完备子图：优先队列分支定界",
    "priority": "必会",
    "topicIds": [
      "ch21-topic-01"
    ],
    "prerequisites": [
      "分支定界思想",
      "对应章节的数据结构"
    ],
    "purpose": "掌握最大完备子图：优先队列分支定界的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“分支定界思想”的输入与状态",
      "执行最大完备子图：优先队列分支定界的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“分支定界思想”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "分支定界思想",
      "pdfPages": "PDF第542-561页（书中第525-544页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nint cliqueUpperBound(int chosen,int remaining){return chosen+remaining;}\nstruct CliqueState{int chosen,next,bound;bool operator<(const CliqueState&o)const{return bound<o.bound;}};"
  },
  {
    "id": "board-arrangement-branch-bound",
    "chapter": 21,
    "category": "分支定界",
    "title": "电路板排列：最小下界优先扩展",
    "priority": "必会",
    "topicIds": [
      "ch21-topic-02"
    ],
    "prerequisites": [
      "货箱装载—分支定界",
      "对应章节的数据结构"
    ],
    "purpose": "掌握电路板排列：最小下界优先扩展的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“货箱装载—分支定界”的输入与状态",
      "执行电路板排列：最小下界优先扩展的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“货箱装载—分支定界”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "货箱装载—分支定界",
      "pdfPages": "PDF第542-561页（书中第525-544页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nstruct BoardState{vector<int>order,unused;int cost,lowerBound;bool operator>(const BoardState&o)const{return lowerBound>o.lowerBound;}};\nint optimisticBoardCost(const BoardState&state){return state.cost;}"
  }
];
