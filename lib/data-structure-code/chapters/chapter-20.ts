import type { CodeReviewItem } from "../types.ts";

export const chapter20Code: CodeReviewItem[] = [
  {
    "id": "backtracking-knapsack",
    "chapter": 20,
    "title": "0/1 背包：回溯骨架",
    "priority": "重点理解",
    "purpose": "按选或不选构造搜索树，并用可行性与上界剪枝。",
    "complexity": "最坏 O(2^n)，实际取决于剪枝质量。",
    "invariant": "进入第 i 层时，当前重量和价值准确代表前 i 件选择。",
    "pitfalls": [
      "返回前必须撤销选择",
      "上界必须乐观",
      "先搜更有希望的分支更快"
    ],
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nvoid dfs(int i, int currentW, int currentV) {\n    if (i == n) { best = max(best, currentV); return; }\n    if (currentW + weight[i] <= capacity) {\n        chosen[i] = true;\n        dfs(i + 1, currentW + weight[i], currentV + value[i]);\n        chosen[i] = false;\n    }\n    if (currentV + optimisticBound(i + 1) > best)\n        dfs(i + 1, currentW, currentV);\n}",
    "category": "回溯法",
    "topicIds": [
      "ch20-topic-03"
    ],
    "prerequisites": [
      "0/1 背包—回溯",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“0/1 背包—回溯”所需的初始状态",
      "按不变式执行“0/1 背包：回溯骨架”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "0/1 背包—回溯",
      "pdfPages": "PDF第519-541页（书中第502-524页）"
    }
  },
  {
    "id": "maximum-clique-backtrack",
    "chapter": 20,
    "title": "最大完备子图：回溯骨架",
    "priority": "重点理解",
    "purpose": "按顶点选或不选搜索，并在候选规模无法超过最优值时剪枝。",
    "complexity": "最坏 O(2^V)。",
    "invariant": "selected 中任意两个已选顶点之间都有边。",
    "pitfalls": [
      "加入顶点前检查与所有已选顶点相邻",
      "剩余顶点上界不足时立即返回"
    ],
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nvoid cliqueDfs(int vertex) {\n    if (currentSize + (n - vertex) <= bestSize) return;\n    if (vertex == n) { bestSize = max(bestSize, currentSize); return; }\n\n    bool compatible = true;\n    for (int u = 0; u < vertex; ++u)\n        if (selected[u] && !adjacent[u][vertex]) compatible = false;\n    if (compatible) {\n        selected[vertex] = true; ++currentSize;\n        cliqueDfs(vertex + 1);\n        --currentSize; selected[vertex] = false;\n    }\n    cliqueDfs(vertex + 1);\n}",
    "category": "回溯法",
    "topicIds": [
      "ch20-topic-04"
    ],
    "prerequisites": [
      "最大完备子图",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“最大完备子图”所需的初始状态",
      "按不变式执行“最大完备子图：回溯骨架”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "最大完备子图",
      "pdfPages": "PDF第519-541页（书中第502-524页）"
    }
  },
  {
    "id": "tsp-backtrack",
    "chapter": 20,
    "title": "旅行商问题：回溯与剪枝",
    "priority": "重点理解",
    "purpose": "逐个选择下一座城市，路径成本已不优于当前最优时停止。",
    "complexity": "最坏 O(n!)。",
    "invariant": "path[0..depth) 不重复，cost 是当前部分路径的准确代价。",
    "pitfalls": [
      "终点必须加上回到起点的边",
      "递归返回后恢复 visited",
      "无边时不能继续"
    ],
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nvoid tspDfs(int depth, int last, long long cost) {\n    if (cost >= best) return;\n    if (depth == n) {\n        if (weight[last][start] < INF)\n            best = min(best, cost + weight[last][start]);\n        return;\n    }\n    for (int next = 0; next < n; ++next) {\n        if (!visited[next] && weight[last][next] < INF) {\n            visited[next] = true;\n            tspDfs(depth + 1, next, cost + weight[last][next]);\n            visited[next] = false;\n        }\n    }\n}",
    "category": "回溯法",
    "topicIds": [
      "ch20-topic-05"
    ],
    "prerequisites": [
      "旅行商问题—回溯",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“旅行商问题—回溯”所需的初始状态",
      "按不变式执行“旅行商问题：回溯与剪枝”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "旅行商问题—回溯",
      "pdfPages": "PDF第519-541页（书中第502-524页）"
    }
  },
  {
    "id": "container-loading-backtracking",
    "chapter": 20,
    "category": "回溯法",
    "title": "货箱装载：深度优先回溯",
    "priority": "必会",
    "topicIds": [
      "ch20-topic-01"
    ],
    "prerequisites": [
      "回溯算法思想",
      "对应章节的数据结构"
    ],
    "purpose": "掌握货箱装载：深度优先回溯的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“回溯算法思想”的输入与状态",
      "执行货箱装载：深度优先回溯的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“回溯算法思想”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "回溯算法思想",
      "pdfPages": "PDF第519-541页（书中第502-524页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nint bestLoading(const vector<int>&weight,int capacity){int best=0;function<void(size_t,int)>dfs=[&](size_t i,int current){if(current>capacity)return;if(i==weight.size()){best=max(best,current);return;}dfs(i+1,current+weight[i]);dfs(i+1,current);};dfs(0,0);return best;}"
  },
  {
    "id": "board-arrangement-backtracking",
    "chapter": 20,
    "category": "回溯法",
    "title": "电路板排列：排列树与剪枝",
    "priority": "必会",
    "topicIds": [
      "ch20-topic-02"
    ],
    "prerequisites": [
      "货箱装载—回溯",
      "对应章节的数据结构"
    ],
    "purpose": "掌握电路板排列：排列树与剪枝的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“货箱装载—回溯”的输入与状态",
      "执行电路板排列：排列树与剪枝的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“货箱装载—回溯”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "货箱装载—回溯",
      "pdfPages": "PDF第519-541页（书中第502-524页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nint minimumArrangement(vector<int>boards){int best=numeric_limits<int>::max();sort(boards.begin(),boards.end());do{int cost=0;for(size_t i=1;i<boards.size();++i)cost+=abs(boards[i]-boards[i-1]);best=min(best,cost);}while(next_permutation(boards.begin(),boards.end()));return best;}"
  }
];
