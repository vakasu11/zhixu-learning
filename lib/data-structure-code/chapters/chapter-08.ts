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
    "code": "bool validBrackets(const string& s) {\n    stack<char> st;\n    for (char c : s) {\n        if (c == '(' || c == '[' || c == '{') st.push(c);\n        else if (c == ')' || c == ']' || c == '}') {\n            if (st.empty()) return false;\n            char left = st.top(); st.pop();\n            if ((left == '(' && c != ')') || (left == '[' && c != ']') ||\n                (left == '{' && c != '}')) return false;\n        }\n    }\n    return st.empty();\n}",
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
    "code": "class ArrayStack {\n    vector<int> data;\npublic:\n    bool empty() const { return data.empty(); }\n    void push(int x) { data.push_back(x); }\n    int pop() {\n        if (data.empty()) throw underflow_error(\"empty stack\");\n        int x = data.back();\n        data.pop_back();\n        return x;\n    }\n};",
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
    "code": "int evaluatePostfix(const vector<string>& token) {\n    stack<int> st;\n    for (auto& s : token) {\n        if (isdigit(s[0]) || s.size() > 1) st.push(stoi(s));\n        else {\n            int right = st.top(); st.pop();\n            int left = st.top(); st.pop();\n            st.push(s == \"+\" ? left + right : left * right);\n        }\n    }\n    return st.top();\n}",
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
  }
];
