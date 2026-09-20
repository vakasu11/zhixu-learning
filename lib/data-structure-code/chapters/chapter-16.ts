import type { CodeReviewItem } from "../types.ts";

export const chapter16Code: CodeReviewItem[] = [
  {
    "id": "graph-traversal",
    "chapter": 16,
    "title": "图的 BFS 与 DFS",
    "priority": "必会",
    "purpose": "遍历图、求连通分量并为最短路和拓扑排序打基础。",
    "complexity": "邻接表下 O(V+E)，空间 O(V)。",
    "invariant": "visited 保证每个顶点最多进入处理流程一次。",
    "pitfalls": [
      "非连通图要多次启动",
      "BFS 入队时立即标记"
    ],
    "code": "void bfs(const vector<vector<int>>& g, int start) {\n    vector<bool> seen(g.size(), false);\n    queue<int> q; q.push(start); seen[start] = true;\n    while (!q.empty()) {\n        int u = q.front(); q.pop();\n        for (int v : g[u]) if (!seen[v]) {\n            seen[v] = true; q.push(v);\n        }\n    }\n}\n\nvoid dfs(const vector<vector<int>>& g, int u, vector<bool>& seen) {\n    seen[u] = true;\n    for (int v : g[u]) if (!seen[v]) dfs(g, v, seen);\n}",
    "category": "图结构",
    "topicIds": [
      "ch16-topic-05"
    ],
    "prerequisites": [
      "广度优先搜索 BFS",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“广度优先搜索 BFS”所需的初始状态",
      "按不变式执行“图的 BFS 与 DFS”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "广度优先搜索 BFS",
      "pdfPages": "PDF第407-436页（书中第390-419页）"
    }
  },
  {
    "id": "adjacency-list",
    "chapter": 16,
    "title": "邻接表建图",
    "priority": "必会",
    "purpose": "以 O(V+E) 空间保存稀疏图，为遍历和最短路提供统一结构。",
    "complexity": "添加一条边 O(1)，空间 O(V+E)。",
    "invariant": "g[u] 只保存从 u 出发的边。",
    "pitfalls": [
      "无向图必须双向添加",
      "加权图保存终点与权重",
      "顶点编号先做范围检查"
    ],
    "code": "using Graph = vector<vector<pair<int,int>>>;\n\nvoid addDirectedEdge(Graph& g, int from, int to, int weight) {\n    g[from].push_back({to, weight});\n}\n\nvoid addUndirectedEdge(Graph& g, int a, int b, int weight) {\n    addDirectedEdge(g, a, b, weight);\n    addDirectedEdge(g, b, a, weight);\n}",
    "category": "图结构",
    "topicIds": [
      "ch16-topic-04"
    ],
    "prerequisites": [
      "邻接矩阵与邻接表",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“邻接矩阵与邻接表”所需的初始状态",
      "按不变式执行“邻接表建图”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "邻接矩阵与邻接表",
      "pdfPages": "PDF第407-436页（书中第390-419页）"
    }
  },
  {
    "id": "connected-components",
    "chapter": 16,
    "title": "无向图连通分量标记",
    "priority": "必会",
    "purpose": "从每个未访问顶点启动 DFS，为同一连通分量赋相同编号。",
    "complexity": "时间 O(V+E)，空间 O(V)。",
    "invariant": "完成一次 DFS 后，与起点连通的所有顶点都获得当前分量编号。",
    "pitfalls": [
      "外层必须扫描所有顶点",
      "有向图应改用强连通分量算法"
    ],
    "code": "int markComponents(const vector<vector<int>>& g, vector<int>& component) {\n    int count = 0;\n    component.assign(g.size(), -1);\n    for (int u = 0; u < (int)g.size(); ++u) {\n        if (component[u] != -1) continue;\n        dfsMark(g, u, count, component);\n        ++count;\n    }\n    return count;\n}",
    "category": "图结构",
    "topicIds": [
      "ch16-topic-08"
    ],
    "prerequisites": [
      "连通分量",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“连通分量”所需的初始状态",
      "按不变式执行“无向图连通分量标记”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "连通分量",
      "pdfPages": "PDF第407-436页（书中第390-419页）"
    }
  }
];
