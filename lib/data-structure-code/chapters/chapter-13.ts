import type { CodeReviewItem } from "../types.ts";

export const chapter13Code: CodeReviewItem[] = [
  {
    "id": "winner-tree",
    "chapter": 13,
    "title": "赢者树：沿路径重赛",
    "priority": "重点理解",
    "purpose": "某个选手变化后，仅沿叶到根路径重新比赛。",
    "complexity": "建树 O(n)，一次重赛 O(log n)。",
    "invariant": "每个内部节点保存其子树的胜者下标。",
    "pitfalls": [
      "树中存选手下标而不是值",
      "先明确较小还是较大者获胜"
    ],
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nint winner(int a, int b, const vector<int>& player) {\n    return player[a] <= player[b] ? a : b;\n}\n\nvoid replay(vector<int>& tree, const vector<int>& player, int leaf) {\n    int node = leaf / 2;\n    while (node > 0) {\n        tree[node] = winner(tree[node * 2], tree[node * 2 + 1], player);\n        node /= 2;\n    }\n}",
    "category": "竞赛树",
    "topicIds": [
      "ch13-topic-03"
    ],
    "prerequisites": [
      "赢者树的实现",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“赢者树的实现”所需的初始状态",
      "按不变式执行“赢者树：沿路径重赛”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "赢者树的实现",
      "pdfPages": "PDF第340-354页（书中第323-337页）"
    }
  },
  {
    "id": "loser-tree",
    "chapter": 13,
    "title": "输者树：调整路径",
    "priority": "重点理解",
    "purpose": "内部节点记录比赛失败者，根附近直接保留总冠军，适合多路归并。",
    "complexity": "一次调整 O(log k)。",
    "invariant": "从选手到根的路径保存它与各层对手比较后的失败者。",
    "pitfalls": [
      "胜负规则要统一",
      "叶子耗尽时使用无穷大哨兵"
    ],
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nvoid adjust(int playerIndex) {\n    int winner = playerIndex;\n    for (int parent = (playerIndex + k) / 2; parent > 0; parent /= 2) {\n        if (lessPlayer(tree[parent], winner))\n            swap(tree[parent], winner);\n    }\n    tree[0] = winner;\n}",
    "category": "竞赛树",
    "topicIds": [
      "ch13-topic-04"
    ],
    "prerequisites": [
      "输者树",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“输者树”所需的初始状态",
      "按不变式执行“输者树：调整路径”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "输者树",
      "pdfPages": "PDF第340-354页（书中第323-337页）"
    }
  },
  {
    "id": "k-way-merge",
    "chapter": 13,
    "title": "竞赛树应用：多路归并",
    "priority": "必会",
    "purpose": "每次输出当前各路首元素中的最小值，再只更新对应一路。",
    "complexity": "输出 N 个元素需要 O(N log k)。",
    "invariant": "竞赛树冠军始终是所有未耗尽输入流的当前最小首元素。",
    "pitfalls": [
      "一路耗尽后用无穷大替代",
      "输出后只重赛发生变化的叶子"
    ],
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nwhile (winnerValue() != INF) {\n    int stream = winnerIndex();\n    output.push_back(current[stream]);\n    if (readNext(stream, current[stream])) replay(stream);\n    else { current[stream] = INF; replay(stream); }\n}",
    "category": "竞赛树",
    "topicIds": [
      "ch13-topic-03"
    ],
    "prerequisites": [
      "赢者树的实现",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“赢者树的实现”所需的初始状态",
      "按不变式执行“竞赛树应用：多路归并”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "赢者树的实现",
      "pdfPages": "PDF第340-354页（书中第323-337页）"
    }
  },
  {
    "id": "first-fit-packing",
    "chapter": 13,
    "category": "竞赛树",
    "title": "首次适配装箱：赢者树思想",
    "priority": "必会",
    "topicIds": [
      "ch13-topic-01"
    ],
    "prerequisites": [
      "赢者树",
      "对应章节的数据结构"
    ],
    "purpose": "掌握首次适配装箱：赢者树思想的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“赢者树”的输入与状态",
      "执行首次适配装箱：赢者树思想的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“赢者树”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "赢者树",
      "pdfPages": "PDF第340-354页（书中第323-337页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nvector<int> firstFitPacking(const vector<int>& objects,int capacity){vector<int>remaining;vector<int>bin;for(int size:objects){auto it=find_if(remaining.begin(),remaining.end(),[&](int space){return space>=size;});if(it==remaining.end()){remaining.push_back(capacity-size);bin.push_back(int(remaining.size()-1));}else{bin.push_back(int(it-remaining.begin()));*it-=size;}}return bin;}"
  },
  {
    "id": "next-fit-packing",
    "chapter": 13,
    "category": "竞赛树",
    "title": "相邻适配装箱：只检查当前箱",
    "priority": "必会",
    "topicIds": [
      "ch13-topic-02"
    ],
    "prerequisites": [
      "WinnerTree 抽象数据类型",
      "对应章节的数据结构"
    ],
    "purpose": "掌握相邻适配装箱：只检查当前箱的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“WinnerTree 抽象数据类型”的输入与状态",
      "执行相邻适配装箱：只检查当前箱的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“WinnerTree 抽象数据类型”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "WinnerTree 抽象数据类型",
      "pdfPages": "PDF第340-354页（书中第323-337页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nvector<int> nextFitPacking(const vector<int>& objects,int capacity){vector<int>bin;int current=0,space=capacity;for(int size:objects){if(size>capacity)throw invalid_argument(\"oversized object\");if(size>space){++current;space=capacity;}space-=size;bin.push_back(current);}return bin;}"
  }
];
