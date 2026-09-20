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
    "code": "int knapsack01(const vector<int>& weight, const vector<int>& value, int capacity) {\n    vector<int> dp(capacity + 1, 0);\n    for (int i = 0; i < (int)weight.size(); ++i)\n        for (int c = capacity; c >= weight[i]; --c)\n            dp[c] = max(dp[c], dp[c - weight[i]] + value[i]);\n    return dp[capacity];\n}",
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
    "code": "void floyd(vector<vector<long long>>& dist) {\n    int n = dist.size();\n    for (int k = 0; k < n; ++k)\n        for (int i = 0; i < n; ++i)\n            for (int j = 0; j < n; ++j)\n                if (dist[i][k] != INF && dist[k][j] != INF)\n                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);\n}",
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
    "code": "bool bellmanFord(int n, const vector<Edge>& edges, int source,\n                 vector<long long>& dist) {\n    dist.assign(n, INF); dist[source] = 0;\n    for (int i = 1; i < n; ++i) {\n        bool changed = false;\n        for (auto& e : edges)\n            if (dist[e.u] != INF && dist[e.u] + e.w < dist[e.v]) {\n                dist[e.v] = dist[e.u] + e.w; changed = true;\n            }\n        if (!changed) break;\n    }\n    for (auto& e : edges)\n        if (dist[e.u] != INF && dist[e.u] + e.w < dist[e.v]) return false;\n    return true;\n}",
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
  }
];
