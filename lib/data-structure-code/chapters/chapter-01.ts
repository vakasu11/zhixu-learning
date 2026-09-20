import type { CodeReviewItem } from "../types.ts";

export const chapter01Code: CodeReviewItem[] = [
  {
    "id": "recursive-sum",
    "chapter": 1,
    "title": "递归求和：递归函数最小骨架",
    "priority": "重点理解",
    "purpose": "看懂递归出口、规模缩小和调用栈，为树遍历、分治与回溯打基础。",
    "complexity": "时间 O(n)，递归栈 O(n)。",
    "invariant": "每次调用把问题从前 n 个元素缩小为前 n-1 个元素。",
    "pitfalls": [
      "必须设置 n == 0 的出口",
      "递归过深可能栈溢出"
    ],
    "code": "template<class T>\nT recursiveSum(const T a[], int n) {\n    if (n == 0) return T{};\n    return recursiveSum(a, n - 1) + a[n - 1];\n}",
    "category": "C++语言基础",
    "topicIds": [
      "ch01-topic-05"
    ],
    "prerequisites": [
      "递归函数",
      "C++17 基础语法"
    ],
    "steps": [
      "根据输入建立“递归函数”所需的初始状态",
      "按不变式执行“递归求和：递归函数最小骨架”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "递归函数",
      "pdfPages": "PDF第19-54页（书中第2-37页）"
    }
  },
  {
    "id": "dynamic-2d-array",
    "chapter": 1,
    "title": "动态二维数组：申请与释放",
    "priority": "必会",
    "purpose": "复习二级指针、异常安全和成对释放资源。",
    "complexity": "申请与释放均为 O(rows)。",
    "invariant": "成功返回时每一行都已分配；失败时已分配行全部释放。",
    "pitfalls": [
      "逐行释放后再释放行指针数组",
      "部分分配失败要回滚",
      "工程中优先使用 vector"
    ],
    "code": "template<class T>\nT** make2D(int rows, int cols) {\n    T** a = new T*[rows]{};\n    try {\n        for (int i = 0; i < rows; ++i) a[i] = new T[cols]{};\n    } catch (...) {\n        for (int i = 0; i < rows; ++i) delete[] a[i];\n        delete[] a;\n        throw;\n    }\n    return a;\n}\n\ntemplate<class T>\nvoid free2D(T** a, int rows) {\n    for (int i = 0; i < rows; ++i) delete[] a[i];\n    delete[] a;\n}",
    "category": "C++语言基础",
    "topicIds": [
      "ch01-topic-03"
    ],
    "prerequisites": [
      "动态内存分配",
      "C++17 基础语法"
    ],
    "steps": [
      "根据输入建立“动态内存分配”所需的初始状态",
      "按不变式执行“动态二维数组：申请与释放”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "动态内存分配",
      "pdfPages": "PDF第19-54页（书中第2-37页）"
    }
  },
  {
    "id": "permutations",
    "chapter": 1,
    "title": "递归生成全排列",
    "priority": "重点理解",
    "purpose": "用交换和回溯展示递归选择、进入下一层和撤销选择。",
    "complexity": "时间 O(n·n!)，递归栈 O(n)。",
    "invariant": "进入第 k 层时，[0,k) 已固定，[k,n) 等待排列。",
    "pitfalls": [
      "递归返回后必须交换回来",
      "有重复元素时需要去重"
    ],
    "code": "void permutations(vector<int>& a, int k) {\n    if (k == (int)a.size()) {\n        print(a);\n        return;\n    }\n    for (int i = k; i < (int)a.size(); ++i) {\n        swap(a[k], a[i]);\n        permutations(a, k + 1);\n        swap(a[k], a[i]);\n    }\n}",
    "category": "C++语言基础",
    "topicIds": [
      "ch01-topic-05"
    ],
    "prerequisites": [
      "递归函数",
      "C++17 基础语法"
    ],
    "steps": [
      "根据输入建立“递归函数”所需的初始状态",
      "按不变式执行“递归生成全排列”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "递归函数",
      "pdfPages": "PDF第19-54页（书中第2-37页）"
    }
  }
];
