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
    "code": "int winner(int a, int b, const vector<int>& player) {\n    return player[a] <= player[b] ? a : b;\n}\n\nvoid replay(vector<int>& tree, const vector<int>& player, int leaf) {\n    int node = leaf / 2;\n    while (node > 0) {\n        tree[node] = winner(tree[node * 2], tree[node * 2 + 1], player);\n        node /= 2;\n    }\n}",
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
    "code": "void adjust(int playerIndex) {\n    int winner = playerIndex;\n    for (int parent = (playerIndex + k) / 2; parent > 0; parent /= 2) {\n        if (lessPlayer(tree[parent], winner))\n            swap(tree[parent], winner);\n    }\n    tree[0] = winner;\n}",
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
    "code": "while (winnerValue() != INF) {\n    int stream = winnerIndex();\n    output.push_back(current[stream]);\n    if (readNext(stream, current[stream])) replay(stream);\n    else { current[stream] = INF; replay(stream); }\n}",
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
  }
];
