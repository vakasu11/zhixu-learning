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
    "code": "void dfs(int i, int currentW, int currentV) {\n    if (i == n) { best = max(best, currentV); return; }\n    if (currentW + weight[i] <= capacity) {\n        chosen[i] = true;\n        dfs(i + 1, currentW + weight[i], currentV + value[i]);\n        chosen[i] = false;\n    }\n    if (currentV + optimisticBound(i + 1) > best)\n        dfs(i + 1, currentW, currentV);\n}",
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
    "code": "void cliqueDfs(int vertex) {\n    if (currentSize + (n - vertex) <= bestSize) return;\n    if (vertex == n) { bestSize = max(bestSize, currentSize); return; }\n\n    bool compatible = true;\n    for (int u = 0; u < vertex; ++u)\n        if (selected[u] && !adjacent[u][vertex]) compatible = false;\n    if (compatible) {\n        selected[vertex] = true; ++currentSize;\n        cliqueDfs(vertex + 1);\n        --currentSize; selected[vertex] = false;\n    }\n    cliqueDfs(vertex + 1);\n}",
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
    "code": "void tspDfs(int depth, int last, long long cost) {\n    if (cost >= best) return;\n    if (depth == n) {\n        if (weight[last][start] < INF)\n            best = min(best, cost + weight[last][start]);\n        return;\n    }\n    for (int next = 0; next < n; ++next) {\n        if (!visited[next] && weight[last][next] < INF) {\n            visited[next] = true;\n            tspDfs(depth + 1, next, cost + weight[last][next]);\n            visited[next] = false;\n        }\n    }\n}",
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
  }
];
