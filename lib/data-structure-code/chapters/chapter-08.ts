import type { CodeReviewItem } from "../types.ts";

export const chapter08Code: CodeReviewItem[] = [
  {
    "id": "bracket-stack",
    "chapter": 8,
    "title": "栈应用：括号匹配",
    "priority": "必会",
    "purpose": "体现后进先出如何保存尚未配对的左括号。",
    "complexity": "时间 O(n)，空间 O(n)。",
    "invariant": "栈保存扫描前缀中尚未匹配的左括号。",
    "pitfalls": [
      "右括号出现时先判空",
      "扫描结束后栈必须为空"
    ],
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nbool validBrackets(const string& s) {\n    stack<char> st;\n    for (char c : s) {\n        if (c == '(' || c == '[' || c == '{') st.push(c);\n        else if (c == ')' || c == ']' || c == '}') {\n            if (st.empty()) return false;\n            char left = st.top(); st.pop();\n            if ((left == '(' && c != ')') || (left == '[' && c != ']') ||\n                (left == '{' && c != '}')) return false;\n        }\n    }\n    return st.empty();\n}",
    "category": "栈与应用",
    "topicIds": [
      "ch08-topic-04"
    ],
    "prerequisites": [
      "括号匹配",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“括号匹配”所需的初始状态",
      "按不变式执行“栈应用：括号匹配”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "括号匹配",
      "pdfPages": "PDF第192-221页（书中第175-204页）"
    }
  },
  {
    "id": "array-stack",
    "chapter": 8,
    "title": "数组栈：push 与 pop",
    "priority": "必会",
    "purpose": "掌握栈顶下标、扩容和空栈异常。",
    "complexity": "push 均摊 O(1)，pop O(1)。",
    "invariant": "data.back() 始终是栈顶。",
    "pitfalls": [
      "pop 前先判空",
      "弹出时若要返回元素，先保存再删除"
    ],
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nclass ArrayStack {\n    vector<int> data;\npublic:\n    bool empty() const { return data.empty(); }\n    void push(int x) { data.push_back(x); }\n    int pop() {\n        if (data.empty()) throw underflow_error(\"empty stack\");\n        int x = data.back();\n        data.pop_back();\n        return x;\n    }\n};",
    "category": "栈与应用",
    "topicIds": [
      "ch08-topic-02"
    ],
    "prerequisites": [
      "数组栈",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“数组栈”所需的初始状态",
      "按不变式执行“数组栈：push 与 pop”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "数组栈",
      "pdfPages": "PDF第192-221页（书中第175-204页）"
    }
  },
  {
    "id": "postfix-evaluation",
    "chapter": 8,
    "title": "栈应用：后缀表达式求值",
    "priority": "必会",
    "purpose": "遇到操作数入栈，遇到运算符弹出两个操作数计算并压回。",
    "complexity": "时间 O(n)，空间 O(n)。",
    "invariant": "栈保存已扫描前缀中尚未参与更高层运算的中间结果。",
    "pitfalls": [
      "先弹出的是右操作数",
      "结束时栈中必须恰好一个结果"
    ],
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nint evaluatePostfix(const vector<string>& token) {\n    stack<int> st;\n    for (auto& s : token) {\n        if (isdigit(s[0]) || s.size() > 1) st.push(stoi(s));\n        else {\n            int right = st.top(); st.pop();\n            int left = st.top(); st.pop();\n            st.push(s == \"+\" ? left + right : left * right);\n        }\n    }\n    return st.top();\n}",
    "category": "栈与应用",
    "topicIds": [
      "ch08-topic-04"
    ],
    "prerequisites": [
      "括号匹配",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“括号匹配”所需的初始状态",
      "按不变式执行“栈应用：后缀表达式求值”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "括号匹配",
      "pdfPages": "PDF第192-221页（书中第175-204页）"
    }
  },
  {
    "id": "linked-stack",
    "chapter": 8,
    "category": "栈与应用",
    "title": "链式栈：unique_ptr 管理结点",
    "priority": "必会",
    "topicIds": [
      "ch08-topic-01"
    ],
    "prerequisites": [
      "栈的抽象数据类型",
      "对应章节的数据结构"
    ],
    "purpose": "掌握链式栈：unique_ptr 管理结点的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“栈的抽象数据类型”的输入与状态",
      "执行链式栈：unique_ptr 管理结点的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“栈的抽象数据类型”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "栈的抽象数据类型",
      "pdfPages": "PDF第192-221页（书中第175-204页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nclass LinkedStack { struct Node{int value; unique_ptr<Node> next;}; unique_ptr<Node> top_; public: void push(int x){ top_=make_unique<Node>(Node{x,move(top_)}); } int pop(){ if(!top_) throw underflow_error(\"stack\"); int x=top_->value; top_=move(top_->next); return x; } };"
  },
  {
    "id": "hanoi-recursive",
    "chapter": 8,
    "category": "栈与应用",
    "title": "汉诺塔：递归搬移",
    "priority": "必会",
    "topicIds": [
      "ch08-topic-02"
    ],
    "prerequisites": [
      "数组栈",
      "对应章节的数据结构"
    ],
    "purpose": "掌握汉诺塔：递归搬移的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“数组栈”的输入与状态",
      "执行汉诺塔：递归搬移的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“数组栈”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "数组栈",
      "pdfPages": "PDF第192-221页（书中第175-204页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nvoid hanoi(int n,char from,char spare,char to,vector<string>& moves){ if(n==0) return; hanoi(n-1,from,to,spare,moves); moves.push_back(string{from}+\"->\"+to); hanoi(n-1,spare,from,to,moves); }"
  },
  {
    "id": "train-rearrangement-stack",
    "chapter": 8,
    "category": "栈与应用",
    "title": "列车重排：栈式缓冲轨道",
    "priority": "必会",
    "topicIds": [
      "ch08-topic-03"
    ],
    "prerequisites": [
      "链式栈",
      "对应章节的数据结构"
    ],
    "purpose": "掌握列车重排：栈式缓冲轨道的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“链式栈”的输入与状态",
      "执行列车重排：栈式缓冲轨道的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“链式栈”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "链式栈",
      "pdfPages": "PDF第192-221页（书中第175-204页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nbool increasingStackOutput(const vector<int>& input){ stack<int> holding; int next=1; for(int car:input){ holding.push(car); while(!holding.empty()&&holding.top()==next){holding.pop();++next;} } return holding.empty(); }"
  },
  {
    "id": "switchbox-routing",
    "chapter": 8,
    "category": "栈与应用",
    "title": "开关盒布线：端点嵌套检查",
    "priority": "重点理解",
    "topicIds": [
      "ch08-topic-04"
    ],
    "prerequisites": [
      "括号匹配",
      "对应章节的数据结构"
    ],
    "purpose": "掌握开关盒布线：端点嵌套检查的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“括号匹配”的输入与状态",
      "执行开关盒布线：端点嵌套检查的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“括号匹配”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "括号匹配",
      "pdfPages": "PDF第192-221页（书中第175-204页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nbool routableSwitchbox(const vector<int>& pins){ stack<int> open; for(int net:pins){ if(!open.empty()&&open.top()==net) open.pop(); else open.push(net); } return open.empty(); }"
  },
  {
    "id": "maze-backtracking",
    "chapter": 8,
    "category": "栈与应用",
    "title": "迷宫老鼠：显式栈回溯",
    "priority": "重点理解",
    "topicIds": [
      "ch08-topic-05"
    ],
    "prerequisites": [
      "汉诺塔",
      "对应章节的数据结构"
    ],
    "purpose": "掌握迷宫老鼠：显式栈回溯的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“汉诺塔”的输入与状态",
      "执行迷宫老鼠：显式栈回溯的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“汉诺塔”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "汉诺塔",
      "pdfPages": "PDF第192-221页（书中第175-204页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nbool mazePath(const vector<string>& grid,pair<int,int> start,pair<int,int> goal){ int n=grid.size(),m=grid[0].size(); vector<vector<bool>> seen(n,vector<bool>(m)); stack<pair<int,int>> todo; todo.push(start); while(!todo.empty()){ auto [r,c]=todo.top();todo.pop(); if(pair{r,c}==goal)return true; if(r<0||c<0||r>=n||c>=m||grid[r][c]=='#'||seen[r][c])continue; seen[r][c]=true; todo.push({r+1,c});todo.push({r-1,c});todo.push({r,c+1});todo.push({r,c-1}); } return false; }"
  }
];
