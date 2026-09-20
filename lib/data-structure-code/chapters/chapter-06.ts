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
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nstruct Node { int value; Node* next; };\n\nvoid insertAfter(Node* prev, int value) {\n    if (!prev) throw invalid_argument(\"prev\");\n    prev->next = new Node{value, prev->next};\n}\n\nvoid eraseAfter(Node* prev) {\n    if (!prev || !prev->next) throw out_of_range(\"erase\");\n    Node* doomed = prev->next;\n    prev->next = doomed->next;\n    delete doomed;\n}",
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
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nstruct DSU {\n    vector<int> parent, rank;\n    explicit DSU(int n) : parent(n), rank(n, 0) {\n        iota(parent.begin(), parent.end(), 0);\n    }\n    int find(int x) {\n        return parent[x] == x ? x : parent[x] = find(parent[x]);\n    }\n    bool unite(int a, int b) {\n        a = find(a); b = find(b);\n        if (a == b) return false;\n        if (rank[a] < rank[b]) swap(a, b);\n        parent[b] = a;\n        if (rank[a] == rank[b]) ++rank[a];\n        return true;\n    }\n};",
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
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nNode* reverseList(Node* head) {\n    Node* prev = nullptr;\n    Node* current = head;\n    while (current) {\n        Node* next = current->next;\n        current->next = prev;\n        prev = current;\n        current = next;\n    }\n    return prev;\n}",
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
  },
  {
    "id": "circular-list-with-header",
    "chapter": 6,
    "category": "链式结构",
    "title": "带头结点循环链表：统一边界",
    "priority": "必会",
    "topicIds": [
      "ch06-topic-01"
    ],
    "prerequisites": [
      "单向链表",
      "对应章节的数据结构"
    ],
    "purpose": "掌握带头结点循环链表：统一边界的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“单向链表”的输入与状态",
      "执行带头结点循环链表：统一边界的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“单向链表”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "单向链表",
      "pdfPages": "PDF第130-162页（书中第113-145页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nstruct RingNode { int value{}; RingNode* next{}; };\n+class CircularList { RingNode head_{0, &head_}; public: void pushFront(int x){ head_.next = new RingNode{x, head_.next}; } bool empty() const { return head_.next == &head_; } };"
  },
  {
    "id": "doubly-linked-list",
    "chapter": 6,
    "category": "链式结构",
    "title": "双向链表：在已知位置前插入",
    "priority": "必会",
    "topicIds": [
      "ch06-topic-02"
    ],
    "prerequisites": [
      "循环链表与头节点",
      "对应章节的数据结构"
    ],
    "purpose": "掌握双向链表：在已知位置前插入的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“循环链表与头节点”的输入与状态",
      "执行双向链表：在已知位置前插入的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“循环链表与头节点”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "循环链表与头节点",
      "pdfPages": "PDF第130-162页（书中第113-145页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nstruct DNode { int value; DNode* prev; DNode* next; };\n+void insertBefore(DNode* position, DNode* node) { node->prev=position->prev; node->next=position; position->prev->next=node; position->prev=node; }"
  },
  {
    "id": "bin-sort",
    "chapter": 6,
    "category": "链式结构",
    "title": "箱子排序：按整数关键字收集",
    "priority": "必会",
    "topicIds": [
      "ch06-topic-03"
    ],
    "prerequisites": [
      "双向链表",
      "对应章节的数据结构"
    ],
    "purpose": "掌握箱子排序：按整数关键字收集的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“双向链表”的输入与状态",
      "执行箱子排序：按整数关键字收集的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“双向链表”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "双向链表",
      "pdfPages": "PDF第130-162页（书中第113-145页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nvector<int> binSort(const vector<int>& values, int maximumKey) {\n    vector<vector<int>> bins(maximumKey + 1); for(int x:values){ if(x<0||x>maximumKey) throw out_of_range(\"key\"); bins[x].push_back(x); }\n    vector<int> result; for(auto& bin:bins) result.insert(result.end(),bin.begin(),bin.end()); return result;\n}"
  },
  {
    "id": "radix-sort",
    "chapter": 6,
    "category": "链式结构",
    "title": "基数排序：按十进制位稳定分配",
    "priority": "重点理解",
    "topicIds": [
      "ch06-topic-04"
    ],
    "prerequisites": [
      "链表插入与删除",
      "对应章节的数据结构"
    ],
    "purpose": "掌握基数排序：按十进制位稳定分配的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“链表插入与删除”的输入与状态",
      "执行基数排序：按十进制位稳定分配的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“链表插入与删除”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "链表插入与删除",
      "pdfPages": "PDF第130-162页（书中第113-145页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nvoid radixSort(vector<unsigned>& values) {\n    unsigned maximum=*max_element(values.begin(),values.end());\n    for(unsigned place=1; maximum/place>0; place*=10){ array<vector<unsigned>,10> bins; for(unsigned x:values) bins[(x/place)%10].push_back(x); size_t k=0; for(auto& b:bins) for(unsigned x:b) values[k++]=x; if(place>maximum/10) break; }\n}"
  },
  {
    "id": "convex-hull-chain",
    "chapter": 6,
    "category": "链式结构",
    "title": "凸包：单调链与叉积",
    "priority": "重点理解",
    "topicIds": [
      "ch06-topic-05"
    ],
    "prerequisites": [
      "箱子排序",
      "对应章节的数据结构"
    ],
    "purpose": "掌握凸包：单调链与叉积的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“箱子排序”的输入与状态",
      "执行凸包：单调链与叉积的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“箱子排序”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "箱子排序",
      "pdfPages": "PDF第130-162页（书中第113-145页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nstruct Point { long long x,y; };\nbool operator<(Point a,Point b){return tie(a.x,a.y)<tie(b.x,b.y);}\nlong long cross(Point a,Point b,Point c){ return (b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x); }\nvector<Point> lowerHull(vector<Point> points){ sort(points.begin(),points.end()); vector<Point> hull; for(auto p:points){ while(hull.size()>1&&cross(hull[hull.size()-2],hull.back(),p)<=0) hull.pop_back(); hull.push_back(p); } return hull; }"
  }
];
