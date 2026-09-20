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
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nvector<int> topoSort(const vector<vector<int>>& g) {\n    vector<int> indegree(g.size(), 0), order;\n    for (auto& edges : g) for (int v : edges) ++indegree[v];\n    queue<int> q;\n    for (int i = 0; i < (int)g.size(); ++i) if (indegree[i] == 0) q.push(i);\n    while (!q.empty()) {\n        int u = q.front(); q.pop(); order.push_back(u);\n        for (int v : g[u]) if (--indegree[v] == 0) q.push(v);\n    }\n    if (order.size() != g.size()) return {};\n    return order;\n}",
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
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nvector<long long> dijkstra(const vector<vector<pair<int,int>>>& g, int s) {\n    const long long INF = 4e18;\n    vector<long long> dist(g.size(), INF); dist[s] = 0;\n    using State = pair<long long,int>;\n    priority_queue<State, vector<State>, greater<State>> pq; pq.push({0, s});\n    while (!pq.empty()) {\n        auto [d, u] = pq.top(); pq.pop();\n        if (d != dist[u]) continue;\n        for (auto [v, w] : g[u]) if (d + w < dist[v]) {\n            dist[v] = d + w; pq.push({dist[v], v});\n        }\n    }\n    return dist;\n}",
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
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nstruct Edge { int u, v, w; };\n\nlong long kruskal(int n, vector<Edge> edges) {\n    sort(edges.begin(), edges.end(), [](auto& a, auto& b){ return a.w < b.w; });\n    DSU dsu(n); long long cost = 0; int used = 0;\n    for (auto& e : edges) if (dsu.unite(e.u, e.v)) {\n        cost += e.w;\n        if (++used == n - 1) break;\n    }\n    if (used != n - 1) throw runtime_error(\"disconnected\");\n    return cost;\n}",
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
  },
  {
    "id": "greedy-container-loading",
    "chapter": 17,
    "category": "贪婪算法",
    "title": "货箱装载：按重量从小到大选择",
    "priority": "必会",
    "topicIds": [
      "ch17-topic-01"
    ],
    "prerequisites": [
      "最优化问题",
      "对应章节的数据结构"
    ],
    "purpose": "掌握货箱装载：按重量从小到大选择的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“最优化问题”的输入与状态",
      "执行货箱装载：按重量从小到大选择的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“最优化问题”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "最优化问题",
      "pdfPages": "PDF第437-462页（书中第420-445页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nvector<int> greedyLoad(vector<int>weights,int capacity){vector<int>chosen;vector<int>order(weights.size());iota(order.begin(),order.end(),0);sort(order.begin(),order.end(),[&](int a,int b){return weights[a]<weights[b];});for(int i:order)if(weights[i]<=capacity){capacity-=weights[i];chosen.push_back(i);}return chosen;}"
  },
  {
    "id": "fractional-knapsack",
    "chapter": 17,
    "category": "贪婪算法",
    "title": "分数背包：按单位价值排序",
    "priority": "必会",
    "topicIds": [
      "ch17-topic-02"
    ],
    "prerequisites": [
      "贪婪选择思想",
      "对应章节的数据结构"
    ],
    "purpose": "掌握分数背包：按单位价值排序的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“贪婪选择思想”的输入与状态",
      "执行分数背包：按单位价值排序的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“贪婪选择思想”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "贪婪选择思想",
      "pdfPages": "PDF第437-462页（书中第420-445页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\ndouble fractionalKnapsack(vector<pair<double,double>>items,double capacity){sort(items.begin(),items.end(),[](auto a,auto b){return a.second/a.first>b.second/b.first;});double value=0;for(auto [weight,profit]:items){double take=min(weight,capacity);value+=take*profit/weight;capacity-=take;if(capacity==0)break;}return value;}"
  },
  {
    "id": "binary-covering",
    "chapter": 17,
    "category": "贪婪算法",
    "title": "二分覆盖：贪婪选择最右端覆盖点",
    "priority": "必会",
    "topicIds": [
      "ch17-topic-03"
    ],
    "prerequisites": [
      "货箱装载",
      "对应章节的数据结构"
    ],
    "purpose": "掌握二分覆盖：贪婪选择最右端覆盖点的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“货箱装载”的输入与状态",
      "执行二分覆盖：贪婪选择最右端覆盖点的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“货箱装载”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "货箱装载",
      "pdfPages": "PDF第437-462页（书中第420-445页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nvector<double> coverPoints(vector<double>points,double radius){sort(points.begin(),points.end());vector<double>centers;for(size_t i=0;i<points.size();){double center=points[i]+radius;centers.push_back(center);double reach=center+radius;while(i<points.size()&&points[i]<=reach)++i;}return centers;}"
  },
  {
    "id": "prim-mst",
    "chapter": 17,
    "category": "贪婪算法",
    "title": "Prim 最小生成树：最小边扩展",
    "priority": "重点理解",
    "topicIds": [
      "ch17-topic-04"
    ],
    "prerequisites": [
      "0/1 背包的贪婪尝试",
      "对应章节的数据结构"
    ],
    "purpose": "掌握Prim 最小生成树：最小边扩展的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“0/1 背包的贪婪尝试”的输入与状态",
      "执行Prim 最小生成树：最小边扩展的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“0/1 背包的贪婪尝试”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "0/1 背包的贪婪尝试",
      "pdfPages": "PDF第437-462页（书中第420-445页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nlong long primMst(const vector<vector<pair<int,int>>>&graph){if(graph.empty())return 0;vector<bool>used(graph.size());using E=pair<int,int>;priority_queue<E,vector<E>,greater<E>>q;q.push({0,0});long long cost=0;int count=0;while(!q.empty()){auto [w,u]=q.top();q.pop();if(used[u])continue;used[u]=true;cost+=w;++count;for(auto [v,c]:graph[u])if(!used[v])q.push({c,v});}if(count!=int(graph.size()))throw runtime_error(\"graph is disconnected\");return cost;}"
  }
];
