import type { CodeReviewItem } from "../types.ts";

export const chapter06Code: CodeReviewItem[] = [
  {
    "id": "singly-linked-list",
    "chapter": 6,
    "title": "单向链表：插入与删除",
    "priority": "必会",
    "purpose": "掌握指针重连顺序，以及链表随机访问为何是 O(n)。",
    "complexity": "已知前驱时 O(1)；按下标定位 O(n)。",
    "invariant": "修改后从头结点仍可按顺序访问所有保留节点。",
    "pitfalls": [
      "删除前保存待删节点",
      "头部操作可用虚拟头结点统一",
      "析构时先保存 next"
    ],
    "code": "struct Node { int value; Node* next; };\n\nvoid insertAfter(Node* prev, int value) {\n    if (!prev) throw invalid_argument(\"prev\");\n    prev->next = new Node{value, prev->next};\n}\n\nvoid eraseAfter(Node* prev) {\n    if (!prev || !prev->next) throw out_of_range(\"erase\");\n    Node* doomed = prev->next;\n    prev->next = doomed->next;\n    delete doomed;\n}",
    "category": "链式结构",
    "topicIds": [
      "ch06-topic-01"
    ],
    "prerequisites": [
      "单向链表",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“单向链表”所需的初始状态",
      "按不变式执行“单向链表：插入与删除”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "单向链表",
      "pdfPages": "PDF第130-162页（书中第113-145页）"
    }
  },
  {
    "id": "union-find",
    "chapter": 6,
    "title": "并查集：路径压缩与按秩合并",
    "priority": "必会",
    "purpose": "高效维护等价类，也是 Kruskal 算法的关键组件。",
    "complexity": "均摊 O(α(n))，实际接近常数。",
    "invariant": "每个集合有唯一根，根的 parent 指向自己。",
    "pitfalls": [
      "合并两个根而不是原始节点",
      "路径压缩要写回 parent",
      "等秩合并才增加 rank"
    ],
    "code": "struct DSU {\n    vector<int> parent, rank;\n    explicit DSU(int n) : parent(n), rank(n, 0) {\n        iota(parent.begin(), parent.end(), 0);\n    }\n    int find(int x) {\n        return parent[x] == x ? x : parent[x] = find(parent[x]);\n    }\n    bool unite(int a, int b) {\n        a = find(a); b = find(b);\n        if (a == b) return false;\n        if (rank[a] < rank[b]) swap(a, b);\n        parent[b] = a;\n        if (rank[a] == rank[b]) ++rank[a];\n        return true;\n    }\n};",
    "category": "链式结构",
    "topicIds": [
      "ch06-topic-08"
    ],
    "prerequisites": [
      "并查集",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“并查集”所需的初始状态",
      "按不变式执行“并查集：路径压缩与按秩合并”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "并查集",
      "pdfPages": "PDF第130-162页（书中第113-145页）"
    }
  },
  {
    "id": "reverse-list",
    "chapter": 6,
    "title": "单向链表原地反转",
    "priority": "必会",
    "purpose": "训练保存后继、反转指针和推进三个动作的严格顺序。",
    "complexity": "时间 O(n)，额外空间 O(1)。",
    "invariant": "prev 指向已反转前缀，current 指向尚未处理后缀首节点。",
    "pitfalls": [
      "改 next 前先保存后继",
      "结束后 head 应更新为 prev"
    ],
    "code": "Node* reverseList(Node* head) {\n    Node* prev = nullptr;\n    Node* current = head;\n    while (current) {\n        Node* next = current->next;\n        current->next = prev;\n        prev = current;\n        current = next;\n    }\n    return prev;\n}",
    "category": "链式结构",
    "topicIds": [
      "ch06-topic-04"
    ],
    "prerequisites": [
      "链表插入与删除",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“链表插入与删除”所需的初始状态",
      "按不变式执行“单向链表原地反转”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "链表插入与删除",
      "pdfPages": "PDF第130-162页（书中第113-145页）"
    }
  }
];
