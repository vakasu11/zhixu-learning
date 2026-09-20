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
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nclass CircularQueue {\n    vector<int> data; int front = 0, count = 0;\npublic:\n    explicit CircularQueue(int capacity) : data(capacity) {}\n    void push(int x) {\n        if (count == (int)data.size()) throw overflow_error(\"full\");\n        data[(front + count) % data.size()] = x; ++count;\n    }\n    int pop() {\n        if (count == 0) throw underflow_error(\"empty\");\n        int x = data[front];\n        front = (front + 1) % data.size(); --count;\n        return x;\n    }\n};",
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
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nclass LinkedQueue {\n    Node *head = nullptr, *tail = nullptr;\npublic:\n    void push(int value) {\n        Node* node = new Node{value, nullptr};\n        if (tail) tail->next = node; else head = node;\n        tail = node;\n    }\n    int pop() {\n        if (!head) throw underflow_error(\"empty queue\");\n        Node* node = head; int value = node->value;\n        head = head->next;\n        if (!head) tail = nullptr;\n        delete node;\n        return value;\n    }\n};",
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
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nint bestTrack(const vector<queue<int>>& track, int car) {\n    int best = -1, bestBack = -1;\n    for (int i = 0; i < (int)track.size(); ++i) {\n        if (track[i].empty()) {\n            if (best == -1) best = i;\n        } else if (track[i].back() < car && track[i].back() > bestBack) {\n            best = i;\n            bestBack = track[i].back();\n        }\n    }\n    return best;\n}",
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
  },
  {
    "id": "grid-shortest-path",
    "chapter": 9,
    "category": "队列与应用",
    "title": "电路布线：网格 BFS 最短路",
    "priority": "必会",
    "topicIds": [
      "ch09-topic-01"
    ],
    "prerequisites": [
      "队列的抽象数据类型",
      "对应章节的数据结构"
    ],
    "purpose": "掌握电路布线：网格 BFS 最短路的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“队列的抽象数据类型”的输入与状态",
      "执行电路布线：网格 BFS 最短路的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“队列的抽象数据类型”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "队列的抽象数据类型",
      "pdfPages": "PDF第222-251页（书中第205-234页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nint gridDistance(const vector<string>& grid,pair<int,int> source,pair<int,int> target){ int n=grid.size(),m=grid[0].size(); vector<vector<int>> d(n,vector<int>(m,-1)); queue<pair<int,int>> q; q.push(source);d[source.first][source.second]=0; int dr[]={1,-1,0,0},dc[]={0,0,1,-1}; while(!q.empty()){auto [r,c]=q.front();q.pop(); if(pair{r,c}==target)return d[r][c]; for(int k=0;k<4;++k){int nr=r+dr[k],nc=c+dc[k];if(nr>=0&&nc>=0&&nr<n&&nc<m&&grid[nr][nc]!='#'&&d[nr][nc]<0){d[nr][nc]=d[r][c]+1;q.push({nr,nc});}}} return -1; }"
  },
  {
    "id": "image-component-labeling",
    "chapter": 9,
    "category": "队列与应用",
    "title": "图元识别：队列标记连通区域",
    "priority": "必会",
    "topicIds": [
      "ch09-topic-02"
    ],
    "prerequisites": [
      "数组队列与循环队列",
      "对应章节的数据结构"
    ],
    "purpose": "掌握图元识别：队列标记连通区域的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“数组队列与循环队列”的输入与状态",
      "执行图元识别：队列标记连通区域的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“数组队列与循环队列”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "数组队列与循环队列",
      "pdfPages": "PDF第222-251页（书中第205-234页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nint labelComponents(vector<vector<int>>& image){ int label=0,n=image.size(),m=image[0].size(); int dr[]={1,-1,0,0},dc[]={0,0,1,-1}; for(int r=0;r<n;++r)for(int c=0;c<m;++c)if(image[r][c]==1){ ++label; queue<pair<int,int>>q;q.push({r,c});image[r][c]=label+1; while(!q.empty()){auto [x,y]=q.front();q.pop();for(int k=0;k<4;++k){int a=x+dr[k],b=y+dc[k];if(a>=0&&b>=0&&a<n&&b<m&&image[a][b]==1){image[a][b]=label+1;q.push({a,b});}}}} return label; }"
  },
  {
    "id": "factory-event-simulation",
    "chapter": 9,
    "category": "队列与应用",
    "title": "工厂仿真：按时间处理事件",
    "priority": "必会",
    "topicIds": [
      "ch09-topic-03"
    ],
    "prerequisites": [
      "链式队列",
      "对应章节的数据结构"
    ],
    "purpose": "掌握工厂仿真：按时间处理事件的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“链式队列”的输入与状态",
      "执行工厂仿真：按时间处理事件的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“链式队列”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "链式队列",
      "pdfPages": "PDF第222-251页（书中第205-234页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nstruct Event{double time;int machine;bool operator>(const Event& other)const{return time>other.time;}};\nvector<Event> simulate(vector<Event> initial){ priority_queue<Event,vector<Event>,greater<Event>> events(initial.begin(),initial.end()); vector<Event> order; while(!events.empty()){order.push_back(events.top());events.pop();} return order; }"
  }
];
