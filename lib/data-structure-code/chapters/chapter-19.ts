import type { CodeReviewItem } from "../types.ts";

export const chapter19Code: CodeReviewItem[] = [
  {
    "id": "knapsack-dp",
    "chapter": 19,
    "title": "0/1 背包：一维动态规划",
    "priority": "必会",
    "purpose": "用状态复用避免枚举所有子集。",
    "complexity": "时间 O(nC)，空间 O(C)。",
    "invariant": "处理完前 i 件后，dp[c] 是容量 c 下的最大价值。",
    "pitfalls": [
      "容量必须从大到小",
      "从小到大将变成完全背包",
      "先写清状态含义"
    ],
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nint knapsack01(const vector<int>& weight, const vector<int>& value, int capacity) {\n    vector<int> dp(capacity + 1, 0);\n    for (int i = 0; i < (int)weight.size(); ++i)\n        for (int c = capacity; c >= weight[i]; --c)\n            dp[c] = max(dp[c], dp[c - weight[i]] + value[i]);\n    return dp[capacity];\n}",
    "category": "动态规划",
    "topicIds": [
      "ch19-topic-02"
    ],
    "prerequisites": [
      "0/1 背包—动态规划",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“0/1 背包—动态规划”所需的初始状态",
      "按不变式执行“0/1 背包：一维动态规划”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "0/1 背包—动态规划",
      "pdfPages": "PDF第496-518页（书中第479-501页）"
    }
  },
  {
    "id": "floyd",
    "chapter": 19,
    "title": "Floyd 所有顶点对最短路径",
    "priority": "必会",
    "purpose": "逐步允许更多中间顶点，求任意两点最短距离。",
    "complexity": "时间 O(V³)，空间 O(V²)。",
    "invariant": "第 k 轮后，路径只使用编号不超过 k 的中间顶点。",
    "pitfalls": [
      "k 必须放在最外层",
      "两段距离有限时才相加",
      "负权环会破坏结果"
    ],
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nvoid floyd(vector<vector<long long>>& dist) {\n    int n = dist.size();\n    for (int k = 0; k < n; ++k)\n        for (int i = 0; i < n; ++i)\n            for (int j = 0; j < n; ++j)\n                if (dist[i][k] != INF && dist[k][j] != INF)\n                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);\n}",
    "category": "动态规划",
    "topicIds": [
      "ch19-topic-04"
    ],
    "prerequisites": [
      "所有顶点对最短路径",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“所有顶点对最短路径”所需的初始状态",
      "按不变式执行“Floyd 所有顶点对最短路径”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "所有顶点对最短路径",
      "pdfPages": "PDF第496-518页（书中第479-501页）"
    }
  },
  {
    "id": "bellman-ford",
    "chapter": 19,
    "title": "Bellman-Ford：含负权最短路径",
    "priority": "必会",
    "purpose": "反复松弛所有边，并检测从源点可达的负权环。",
    "complexity": "时间 O(VE)，空间 O(V)。",
    "invariant": "第 i 轮后，dist 至少覆盖使用不超过 i 条边的最短路径。",
    "pitfalls": [
      "无穷大距离不能参与加法",
      "第 V 轮仍可松弛说明存在可达负环"
    ],
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nbool bellmanFord(int n, const vector<Edge>& edges, int source,\n                 vector<long long>& dist) {\n    dist.assign(n, INF); dist[source] = 0;\n    for (int i = 1; i < n; ++i) {\n        bool changed = false;\n        for (auto& e : edges)\n            if (dist[e.u] != INF && dist[e.u] + e.w < dist[e.v]) {\n                dist[e.v] = dist[e.u] + e.w; changed = true;\n            }\n        if (!changed) break;\n    }\n    for (auto& e : edges)\n        if (dist[e.u] != INF && dist[e.u] + e.w < dist[e.v]) return false;\n    return true;\n}",
    "category": "动态规划",
    "topicIds": [
      "ch19-topic-05"
    ],
    "prerequisites": [
      "含负权单源最短路径",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“含负权单源最短路径”所需的初始状态",
      "按不变式执行“Bellman-Ford：含负权最短路径”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "含负权单源最短路径",
      "pdfPages": "PDF第496-518页（书中第479-501页）"
    }
  },
  {
    "id": "matrix-chain-dp",
    "chapter": 19,
    "category": "动态规划",
    "title": "矩阵连乘：区间动态规划",
    "priority": "必会",
    "topicIds": [
      "ch19-topic-01"
    ],
    "prerequisites": [
      "动态规划思想",
      "对应章节的数据结构"
    ],
    "purpose": "掌握矩阵连乘：区间动态规划的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“动态规划思想”的输入与状态",
      "执行矩阵连乘：区间动态规划的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“动态规划思想”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "动态规划思想",
      "pdfPages": "PDF第496-518页（书中第479-501页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nlong long matrixChain(const vector<int>&dimension){int n=dimension.size()-1;vector<vector<long long>>dp(n,vector<long long>(n));for(int length=2;length<=n;++length)for(int i=0;i+length<=n;++i){int j=i+length-1;dp[i][j]=numeric_limits<long long>::max();for(int k=i;k<j;++k)dp[i][j]=min(dp[i][j],dp[i][k]+dp[k+1][j]+1LL*dimension[i]*dimension[k+1]*dimension[j+1]);}return n?dp[0][n-1]:0;}"
  },
  {
    "id": "noncrossing-subset-dp",
    "chapter": 19,
    "category": "动态规划",
    "title": "无交叉子集：最长递增子序列建模",
    "priority": "必会",
    "topicIds": [
      "ch19-topic-02"
    ],
    "prerequisites": [
      "0/1 背包—动态规划",
      "对应章节的数据结构"
    ],
    "purpose": "掌握无交叉子集：最长递增子序列建模的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“0/1 背包—动态规划”的输入与状态",
      "执行无交叉子集：最长递增子序列建模的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“0/1 背包—动态规划”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "0/1 背包—动态规划",
      "pdfPages": "PDF第496-518页（书中第479-501页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nint maximumNoncrossing(const vector<int>&partner){vector<int>tails;for(int value:partner){auto it=lower_bound(tails.begin(),tails.end(),value);if(it==tails.end())tails.push_back(value);else*it=value;}return int(tails.size());}"
  }
];
