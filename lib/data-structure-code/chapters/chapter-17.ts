import type { CodeReviewItem } from "../types.ts";

export const chapter17Code: CodeReviewItem[] = [
  {
    "id": "topological-sort",
    "chapter": 17,
    "title": "拓扑排序：Kahn 算法",
    "priority": "必会",
    "purpose": "不断删除入度为 0 的顶点，生成依赖顺序。",
    "complexity": "时间 O(V+E)，空间 O(V)。",
    "invariant": "队列只含当前剩余图中入度为 0 的顶点。",
    "pitfalls": [
      "结果不足 V 个说明有环",
      "每删除一条边都更新入度"
    ],
    "code": "vector<int> topoSort(const vector<vector<int>>& g) {\n    vector<int> indegree(g.size(), 0), order;\n    for (auto& edges : g) for (int v : edges) ++indegree[v];\n    queue<int> q;\n    for (int i = 0; i < (int)g.size(); ++i) if (indegree[i] == 0) q.push(i);\n    while (!q.empty()) {\n        int u = q.front(); q.pop(); order.push_back(u);\n        for (int v : g[u]) if (--indegree[v] == 0) q.push(v);\n    }\n    if (order.size() != g.size()) return {};\n    return order;\n}",
    "category": "贪婪算法",
    "topicIds": [
      "ch17-topic-05"
    ],
    "prerequisites": [
      "拓扑排序",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“拓扑排序”所需的初始状态",
      "按不变式执行“拓扑排序：Kahn 算法”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "拓扑排序",
      "pdfPages": "PDF第437-462页（书中第420-445页）"
    }
  },
  {
    "id": "dijkstra",
    "chapter": 17,
    "title": "Dijkstra 单源最短路径",
    "priority": "必会",
    "purpose": "反复确定当前最近顶点并松弛出边。",
    "complexity": "邻接表加优先队列 O((V+E) log V)。",
    "invariant": "弹出且距离未过期的顶点，其最短距离已确定。",
    "pitfalls": [
      "不能处理负权边",
      "跳过优先队列中的旧距离",
      "注意无穷大与溢出"
    ],
    "code": "vector<long long> dijkstra(const vector<vector<pair<int,int>>>& g, int s) {\n    const long long INF = 4e18;\n    vector<long long> dist(g.size(), INF); dist[s] = 0;\n    using State = pair<long long,int>;\n    priority_queue<State, vector<State>, greater<State>> pq; pq.push({0, s});\n    while (!pq.empty()) {\n        auto [d, u] = pq.top(); pq.pop();\n        if (d != dist[u]) continue;\n        for (auto [v, w] : g[u]) if (d + w < dist[v]) {\n            dist[v] = d + w; pq.push({dist[v], v});\n        }\n    }\n    return dist;\n}",
    "category": "贪婪算法",
    "topicIds": [
      "ch17-topic-07"
    ],
    "prerequisites": [
      "单源最短路径",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“单源最短路径”所需的初始状态",
      "按不变式执行“Dijkstra 单源最短路径”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "单源最短路径",
      "pdfPages": "PDF第437-462页（书中第420-445页）"
    }
  },
  {
    "id": "kruskal",
    "chapter": 17,
    "title": "Kruskal 最小生成树",
    "priority": "必会",
    "purpose": "按边权从小到大选择不成环的边。",
    "complexity": "时间 O(E log E)。",
    "invariant": "已选边始终是一片可扩展为最小生成树的森林。",
    "pitfalls": [
      "无向边不要重复",
      "unite 为 false 表示成环",
      "不连通图没有生成树"
    ],
    "code": "struct Edge { int u, v, w; };\n\nlong long kruskal(int n, vector<Edge> edges) {\n    sort(edges.begin(), edges.end(), [](auto& a, auto& b){ return a.w < b.w; });\n    DSU dsu(n); long long cost = 0; int used = 0;\n    for (auto& e : edges) if (dsu.unite(e.u, e.v)) {\n        cost += e.w;\n        if (++used == n - 1) break;\n    }\n    if (used != n - 1) throw runtime_error(\"disconnected\");\n    return cost;\n}",
    "category": "贪婪算法",
    "topicIds": [
      "ch17-topic-08"
    ],
    "prerequisites": [
      "最小成本生成树",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“最小成本生成树”所需的初始状态",
      "按不变式执行“Kruskal 最小生成树”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "最小成本生成树",
      "pdfPages": "PDF第437-462页（书中第420-445页）"
    }
  }
];
