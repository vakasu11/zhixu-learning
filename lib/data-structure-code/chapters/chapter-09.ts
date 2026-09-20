import type { CodeReviewItem } from "../types.ts";

export const chapter09Code: CodeReviewItem[] = [
  {
    "id": "circular-queue",
    "chapter": 9,
    "title": "循环队列：入队与出队",
    "priority": "必会",
    "purpose": "用取模复用数组前部空间，并区分队空与队满。",
    "complexity": "入队、出队均为 O(1)。",
    "invariant": "front 指向队首，(front + count) % capacity 指向入队位置。",
    "pitfalls": [
      "额外保存 count 或牺牲一个槽位",
      "下标移动必须取模"
    ],
    "code": "class CircularQueue {\n    vector<int> data; int front = 0, count = 0;\npublic:\n    explicit CircularQueue(int capacity) : data(capacity) {}\n    void push(int x) {\n        if (count == (int)data.size()) throw overflow_error(\"full\");\n        data[(front + count) % data.size()] = x; ++count;\n    }\n    int pop() {\n        if (count == 0) throw underflow_error(\"empty\");\n        int x = data[front];\n        front = (front + 1) % data.size(); --count;\n        return x;\n    }\n};",
    "category": "队列与应用",
    "topicIds": [
      "ch09-topic-02"
    ],
    "prerequisites": [
      "数组队列与循环队列",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“数组队列与循环队列”所需的初始状态",
      "按不变式执行“循环队列：入队与出队”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "数组队列与循环队列",
      "pdfPages": "PDF第222-251页（书中第205-234页）"
    }
  },
  {
    "id": "linked-queue",
    "chapter": 9,
    "title": "链式队列：双指针实现",
    "priority": "必会",
    "purpose": "用 head/tail 保证两端操作都是常数时间。",
    "complexity": "入队和出队均为 O(1)。",
    "invariant": "空队列时 head 和 tail 同时为空；非空时 tail->next 为空。",
    "pitfalls": [
      "删除最后一个节点后 tail 也要置空",
      "不要每次入队都从头遍历"
    ],
    "code": "class LinkedQueue {\n    Node *head = nullptr, *tail = nullptr;\npublic:\n    void push(int value) {\n        Node* node = new Node{value, nullptr};\n        if (tail) tail->next = node; else head = node;\n        tail = node;\n    }\n    int pop() {\n        if (!head) throw underflow_error(\"empty queue\");\n        Node* node = head; int value = node->value;\n        head = head->next;\n        if (!head) tail = nullptr;\n        delete node;\n        return value;\n    }\n};",
    "category": "队列与应用",
    "topicIds": [
      "ch09-topic-03"
    ],
    "prerequisites": [
      "链式队列",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“链式队列”所需的初始状态",
      "按不变式执行“链式队列：双指针实现”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "链式队列",
      "pdfPages": "PDF第222-251页（书中第205-234页）"
    }
  },
  {
    "id": "queue-train",
    "chapter": 9,
    "title": "队列应用：按轨道缓冲重排",
    "priority": "重点理解",
    "purpose": "展示多条 FIFO 缓冲轨道如何支持按目标顺序输出。",
    "complexity": "取决于轨道选择策略，基本扫描 O(nk)。",
    "invariant": "每条轨道内部保持入队顺序，轨道尾元素必须允许当前车厢放入。",
    "pitfalls": [
      "队列只能从头部输出",
      "轨道选择要避免阻塞后续更小编号"
    ],
    "code": "int bestTrack(const vector<queue<int>>& track, int car) {\n    int best = -1, bestBack = -1;\n    for (int i = 0; i < (int)track.size(); ++i) {\n        if (track[i].empty()) {\n            if (best == -1) best = i;\n        } else if (track[i].back() < car && track[i].back() > bestBack) {\n            best = i;\n            bestBack = track[i].back();\n        }\n    }\n    return best;\n}",
    "category": "队列与应用",
    "topicIds": [
      "ch09-topic-04"
    ],
    "prerequisites": [
      "列车车厢重排—队列",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“列车车厢重排—队列”所需的初始状态",
      "按不变式执行“队列应用：按轨道缓冲重排”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "列车车厢重排—队列",
      "pdfPages": "PDF第222-251页（书中第205-234页）"
    }
  }
];
