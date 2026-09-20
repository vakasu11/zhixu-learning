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
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\ntemplate<class T>\nT recursiveSum(const T a[], int n) {\n    if (n == 0) return T{};\n    return recursiveSum(a, n - 1) + a[n - 1];\n}",
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
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\ntemplate<class T>\nT** make2D(int rows, int cols) {\n    T** a = new T*[rows]{};\n    try {\n        for (int i = 0; i < rows; ++i) a[i] = new T[cols]{};\n    } catch (...) {\n        for (int i = 0; i < rows; ++i) delete[] a[i];\n        delete[] a;\n        throw;\n    }\n    return a;\n}\n\ntemplate<class T>\nvoid free2D(T** a, int rows) {\n    for (int i = 0; i < rows; ++i) delete[] a[i];\n    delete[] a;\n}",
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
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nvoid permutations(vector<int>& a, int k) {\n    if (k == (int)a.size()) {\n        print(a);\n        return;\n    }\n    for (int i = k; i < (int)a.size(); ++i) {\n        swap(a[k], a[i]);\n        permutations(a, k + 1);\n        swap(a[k], a[i]);\n    }\n}",
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
  },
  {
    "id": "pass-by-reference",
    "chapter": 1,
    "category": "C++语言基础",
    "title": "引用参数：交换并返回多个结果",
    "priority": "必会",
    "topicIds": [
      "ch01-topic-01"
    ],
    "prerequisites": [
      "函数与参数",
      "C++17 基础语法"
    ],
    "purpose": "掌握引用参数：交换并返回多个结果的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“函数与参数”的输入与状态",
      "执行引用参数：交换并返回多个结果的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“函数与参数”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "函数与参数",
      "pdfPages": "PDF第19-54页（书中第2-37页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\ntemplate<class T>\nvoid exchange(T& left, T& right) { T temporary = std::move(left); left = std::move(right); right = std::move(temporary); }"
  },
  {
    "id": "checked-array-access",
    "chapter": 1,
    "category": "C++语言基础",
    "title": "异常处理：带边界检查的数组访问",
    "priority": "必会",
    "topicIds": [
      "ch01-topic-02"
    ],
    "prerequisites": [
      "异常处理",
      "C++17 基础语法"
    ],
    "purpose": "掌握异常处理：带边界检查的数组访问的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“异常处理”的输入与状态",
      "执行异常处理：带边界检查的数组访问的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“异常处理”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "异常处理",
      "pdfPages": "PDF第19-54页（书中第2-37页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\ntemplate<class T>\nconst T& checkedAt(const vector<T>& values, size_t index) {\n    if (index >= values.size()) throw out_of_range(\"array index\");\n    return values[index];\n}"
  },
  {
    "id": "dynamic-array-raii",
    "chapter": 1,
    "category": "C++语言基础",
    "title": "动态数组：用 RAII 管理所有权",
    "priority": "必会",
    "topicIds": [
      "ch01-topic-03"
    ],
    "prerequisites": [
      "动态内存分配",
      "C++17 基础语法"
    ],
    "purpose": "掌握动态数组：用 RAII 管理所有权的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“动态内存分配”的输入与状态",
      "执行动态数组：用 RAII 管理所有权的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“动态内存分配”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "动态内存分配",
      "pdfPages": "PDF第19-54页（书中第2-37页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\ntemplate<class T>\nclass DynamicArray {\n    unique_ptr<T[]> data_; size_t size_;\npublic:\n    explicit DynamicArray(size_t n) : data_(make_unique<T[]>(n)), size_(n) {}\n    T& at(size_t i) { if (i >= size_) throw out_of_range(\"index\"); return data_[i]; }\n    size_t size() const { return size_; }\n};"
  },
  {
    "id": "stl-algorithm-pipeline",
    "chapter": 1,
    "category": "C++语言基础",
    "title": "STL 算法流水线：筛选、排序与求和",
    "priority": "重点理解",
    "topicIds": [
      "ch01-topic-04"
    ],
    "prerequisites": [
      "自定义数据类型",
      "C++17 基础语法"
    ],
    "purpose": "掌握STL 算法流水线：筛选、排序与求和的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“自定义数据类型”的输入与状态",
      "执行STL 算法流水线：筛选、排序与求和的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“自定义数据类型”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "自定义数据类型",
      "pdfPages": "PDF第19-54页（书中第2-37页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nint positiveSum(vector<int> values) {\n    values.erase(remove_if(values.begin(), values.end(), [](int x) { return x <= 0; }), values.end());\n    sort(values.begin(), values.end());\n    return accumulate(values.begin(), values.end(), 0);\n}"
  },
  {
    "id": "assertion-test-harness",
    "chapter": 1,
    "category": "C++语言基础",
    "title": "断言测试：验证函数边界",
    "priority": "重点理解",
    "topicIds": [
      "ch01-topic-05"
    ],
    "prerequisites": [
      "递归函数",
      "C++17 基础语法"
    ],
    "purpose": "掌握断言测试：验证函数边界的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“递归函数”的输入与状态",
      "执行断言测试：验证函数边界的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“递归函数”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "递归函数",
      "pdfPages": "PDF第19-54页（书中第2-37页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nint square(int value) { return value * value; }\nvoid runTests() { assert(square(0) == 0); assert(square(-3) == 9); assert(square(4) == 16); }"
  }
];
