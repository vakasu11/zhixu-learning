import type { CodeReviewItem } from "../types.ts";

export const chapter12Code: CodeReviewItem[] = [
  {
    "id": "max-heap",
    "chapter": 12,
    "title": "大根堆：上滤与下滤",
    "priority": "必会",
    "purpose": "维护完全二叉树的堆序性质，实现优先级队列。",
    "complexity": "插入、删除最大值 O(log n)；取最大值 O(1)。",
    "invariant": "除当前调整路径外，每个父节点均不小于孩子。",
    "pitfalls": [
      "0 下标孩子为 2i+1、2i+2",
      "下滤选择更大的孩子"
    ],
    "code": "void pushHeap(vector<int>& h, int x) {\n    h.push_back(x);\n    int i = h.size() - 1;\n    while (i > 0) {\n        int p = (i - 1) / 2;\n        if (h[p] >= h[i]) break;\n        swap(h[p], h[i]); i = p;\n    }\n}\n\nint popHeap(vector<int>& h) {\n    int top = h[0]; h[0] = h.back(); h.pop_back();\n    for (int i = 0; ; ) {\n        int l = 2*i+1, r = l+1, best = i;\n        if (l < (int)h.size() && h[l] > h[best]) best = l;\n        if (r < (int)h.size() && h[r] > h[best]) best = r;\n        if (best == i) break;\n        swap(h[i], h[best]); i = best;\n    }\n    return top;\n}",
    "category": "优先级队列",
    "topicIds": [
      "ch12-topic-02"
    ],
    "prerequisites": [
      "大根堆",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“大根堆”所需的初始状态",
      "按不变式执行“大根堆：上滤与下滤”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "大根堆",
      "pdfPages": "PDF第314-339页（书中第297-322页）"
    }
  },
  {
    "id": "heapify-sort",
    "chapter": 12,
    "title": "自底向上建堆与堆排序",
    "priority": "必会",
    "purpose": "先在线性时间建大根堆，再反复把最大值放到数组末尾。",
    "complexity": "建堆 O(n)，排序 O(n log n)，原地且不稳定。",
    "invariant": "排序阶段中 [end,n) 已有序，[0,end) 保持大根堆。",
    "pitfalls": [
      "最后一个非叶节点是 n/2-1",
      "交换堆顶后堆大小要缩一"
    ],
    "code": "void heapSort(vector<int>& a) {\n    for (int i = (int)a.size() / 2 - 1; i >= 0; --i)\n        siftDown(a, i, a.size());\n    for (int end = (int)a.size() - 1; end > 0; --end) {\n        swap(a[0], a[end]);\n        siftDown(a, 0, end);\n    }\n}",
    "category": "优先级队列",
    "topicIds": [
      "ch12-topic-06"
    ],
    "prerequisites": [
      "堆排序",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“堆排序”所需的初始状态",
      "按不变式执行“自底向上建堆与堆排序”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "堆排序",
      "pdfPages": "PDF第314-339页（书中第297-322页）"
    }
  },
  {
    "id": "huffman",
    "chapter": 12,
    "title": "霍夫曼树构造",
    "priority": "重点理解",
    "purpose": "反复合并权重最小的两棵树，得到最优前缀编码树。",
    "complexity": "优先队列实现 O(n log n)。",
    "invariant": "队列保存尚未合并的子树，键是子树总权重。",
    "pitfalls": [
      "每次必须取两个最小权重",
      "左右边 0/1 约定不影响码长",
      "单字符输入需特殊处理"
    ],
    "code": "HuffmanNode* buildHuffman(const vector<int>& frequency) {\n    priority_queue<HuffmanNode*, vector<HuffmanNode*>, ByWeight> pq;\n    for (int i = 0; i < (int)frequency.size(); ++i)\n        if (frequency[i] > 0) pq.push(new HuffmanNode{frequency[i], i});\n    while (pq.size() > 1) {\n        auto left = pq.top(); pq.pop();\n        auto right = pq.top(); pq.pop();\n        pq.push(new HuffmanNode{left->weight + right->weight, -1, left, right});\n    }\n    return pq.top();\n}",
    "category": "优先级队列",
    "topicIds": [
      "ch12-topic-08"
    ],
    "prerequisites": [
      "霍夫曼编码",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“霍夫曼编码”所需的初始状态",
      "按不变式执行“霍夫曼树构造”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "霍夫曼编码",
      "pdfPages": "PDF第314-339页（书中第297-322页）"
    }
  }
];
