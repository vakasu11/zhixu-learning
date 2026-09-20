import type { CodeReviewItem } from "../types.ts";

export const chapter07Code: CodeReviewItem[] = [
  {
    "id": "sparse-transpose",
    "chapter": 7,
    "title": "稀疏矩阵快速转置",
    "priority": "重点理解",
    "purpose": "用三元组只存非零元素，并通过列计数一次确定转置位置。",
    "complexity": "时间 O(cols + nonZero)，空间 O(cols + nonZero)。",
    "invariant": "next[col] 指向该列转置后的下一个可写位置。",
    "pitfalls": [
      "先算每列起始位置",
      "转置时行列互换",
      "逐列扫描会更慢"
    ],
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nstruct Term { int row, col, value; };\n\nvector<Term> fastTranspose(const vector<Term>& a, int cols) {\n    vector<int> count(cols, 0), next(cols, 0);\n    for (auto& x : a) ++count[x.col];\n    for (int c = 1; c < cols; ++c) next[c] = next[c - 1] + count[c - 1];\n    vector<Term> b(a.size());\n    for (auto& x : a) b[next[x.col]++] = {x.col, x.row, x.value};\n    return b;\n}",
    "category": "矩阵存储",
    "topicIds": [
      "ch07-topic-05"
    ],
    "prerequisites": [
      "稀疏矩阵",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“稀疏矩阵”所需的初始状态",
      "按不变式执行“稀疏矩阵快速转置”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "稀疏矩阵",
      "pdfPages": "PDF第163-191页（书中第146-174页）"
    }
  },
  {
    "id": "row-major-index",
    "chapter": 7,
    "title": "二维数组行主映射",
    "priority": "必会",
    "purpose": "把二维下标映射到一维连续存储位置。",
    "complexity": "地址计算 O(1)。",
    "invariant": "每跨过一行恰好跳过 cols 个元素。",
    "pitfalls": [
      "下标必须先做范围检查",
      "行主和列主公式不能混用"
    ],
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nint offset2D(int row, int col, int rows, int cols) {\n    if (row < 0 || row >= rows || col < 0 || col >= cols)\n        throw out_of_range(\"matrix index\");\n    return row * cols + col;\n}",
    "category": "矩阵存储",
    "topicIds": [
      "ch07-topic-01"
    ],
    "prerequisites": [
      "数组映射",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“数组映射”所需的初始状态",
      "按不变式执行“二维数组行主映射”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "数组映射",
      "pdfPages": "PDF第163-191页（书中第146-174页）"
    }
  },
  {
    "id": "tri-diagonal",
    "chapter": 7,
    "title": "三对角矩阵压缩存储",
    "priority": "重点理解",
    "purpose": "只保存主对角线及其上下相邻对角线，把空间从 O(n²) 降为 O(n)。",
    "complexity": "访问 O(1)，空间 3n-2。",
    "invariant": "只有满足 |row-col|≤1 的位置可能非零。",
    "pitfalls": [
      "非三对角位置读取为 0",
      "三段对角线长度分别是 n-1、n、n-1"
    ],
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nint getTri(const vector<int>& lower, const vector<int>& diag,\n           const vector<int>& upper, int row, int col) {\n    if (row == col) return diag[row];\n    if (row == col + 1) return lower[col];\n    if (col == row + 1) return upper[row];\n    return 0;\n}",
    "category": "矩阵存储",
    "topicIds": [
      "ch07-topic-04"
    ],
    "prerequisites": [
      "特殊矩阵",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“特殊矩阵”所需的初始状态",
      "按不变式执行“三对角矩阵压缩存储”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "特殊矩阵",
      "pdfPages": "PDF第163-191页（书中第146-174页）"
    }
  },
  {
    "id": "matrix-class",
    "chapter": 7,
    "category": "矩阵存储",
    "title": "矩阵类：连续存储与边界检查",
    "priority": "必会",
    "topicIds": [
      "ch07-topic-01"
    ],
    "prerequisites": [
      "数组映射",
      "对应章节的数据结构"
    ],
    "purpose": "掌握矩阵类：连续存储与边界检查的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“数组映射”的输入与状态",
      "执行矩阵类：连续存储与边界检查的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“数组映射”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "数组映射",
      "pdfPages": "PDF第163-191页（书中第146-174页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nclass Matrix { size_t rows_,cols_; vector<double> data_; public: Matrix(size_t r,size_t c):rows_(r),cols_(c),data_(r*c){} double& at(size_t r,size_t c){ if(r>=rows_||c>=cols_) throw out_of_range(\"matrix\"); return data_[r*cols_+c]; } };"
  },
  {
    "id": "diagonal-matrix",
    "chapter": 7,
    "category": "矩阵存储",
    "title": "对角矩阵：只保存主对角线",
    "priority": "必会",
    "topicIds": [
      "ch07-topic-02"
    ],
    "prerequisites": [
      "二维数组",
      "对应章节的数据结构"
    ],
    "purpose": "掌握对角矩阵：只保存主对角线的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“二维数组”的输入与状态",
      "执行对角矩阵：只保存主对角线的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“二维数组”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "二维数组",
      "pdfPages": "PDF第163-191页（书中第146-174页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nclass DiagonalMatrix { vector<int> diagonal_; public: explicit DiagonalMatrix(size_t n):diagonal_(n){} int get(size_t r,size_t c) const { if(r>=diagonal_.size()||c>=diagonal_.size()) throw out_of_range(\"matrix\"); return r==c?diagonal_[r]:0; } };"
  },
  {
    "id": "lower-triangular-matrix",
    "chapter": 7,
    "category": "矩阵存储",
    "title": "下三角矩阵：一维压缩映射",
    "priority": "必会",
    "topicIds": [
      "ch07-topic-03"
    ],
    "prerequisites": [
      "矩阵抽象数据类型",
      "对应章节的数据结构"
    ],
    "purpose": "掌握下三角矩阵：一维压缩映射的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“矩阵抽象数据类型”的输入与状态",
      "执行下三角矩阵：一维压缩映射的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“矩阵抽象数据类型”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "矩阵抽象数据类型",
      "pdfPages": "PDF第163-191页（书中第146-174页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nclass LowerTriangle { size_t n_; vector<int> data_; public: explicit LowerTriangle(size_t n):n_(n),data_(n*(n+1)/2){} int get(size_t r,size_t c) const { if(r>=n_||c>=n_) throw out_of_range(\"matrix\"); return r>=c?data_[r*(r+1)/2+c]:0; } };"
  },
  {
    "id": "symmetric-matrix",
    "chapter": 7,
    "category": "矩阵存储",
    "title": "对称矩阵：复用下三角存储",
    "priority": "重点理解",
    "topicIds": [
      "ch07-topic-04"
    ],
    "prerequisites": [
      "特殊矩阵",
      "对应章节的数据结构"
    ],
    "purpose": "掌握对称矩阵：复用下三角存储的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“特殊矩阵”的输入与状态",
      "执行对称矩阵：复用下三角存储的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“特殊矩阵”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "特殊矩阵",
      "pdfPages": "PDF第163-191页（书中第146-174页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nsize_t symmetricIndex(size_t row,size_t column){ if(row<column) swap(row,column); return row*(row+1)/2+column; }"
  },
  {
    "id": "sparse-add",
    "chapter": 7,
    "category": "矩阵存储",
    "title": "稀疏矩阵加法：归并有序三元组",
    "priority": "重点理解",
    "topicIds": [
      "ch07-topic-05"
    ],
    "prerequisites": [
      "稀疏矩阵",
      "对应章节的数据结构"
    ],
    "purpose": "掌握稀疏矩阵加法：归并有序三元组的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“稀疏矩阵”的输入与状态",
      "执行稀疏矩阵加法：归并有序三元组的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“稀疏矩阵”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "稀疏矩阵",
      "pdfPages": "PDF第163-191页（书中第146-174页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nstruct Term { int row,column,value; };\nvector<Term> addSparse(const vector<Term>& a,const vector<Term>& b){ vector<Term> out; size_t i=0,j=0; auto key=[](Term t){return pair{t.row,t.column};}; while(i<a.size()||j<b.size()){ if(j==b.size()||(i<a.size()&&key(a[i])<key(b[j]))) out.push_back(a[i++]); else if(i==a.size()||key(b[j])<key(a[i])) out.push_back(b[j++]); else { int v=a[i].value+b[j].value; if(v) out.push_back({a[i].row,a[i].column,v}); ++i;++j; } } return out; }"
  },
  {
    "id": "sparse-multiply",
    "chapter": 7,
    "category": "矩阵存储",
    "title": "稀疏矩阵乘法：按公共下标累加",
    "priority": "重点理解",
    "topicIds": [
      "ch07-topic-06"
    ],
    "prerequisites": [
      "矩阵压缩存储",
      "对应章节的数据结构"
    ],
    "purpose": "掌握稀疏矩阵乘法：按公共下标累加的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“矩阵压缩存储”的输入与状态",
      "执行稀疏矩阵乘法：按公共下标累加的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“矩阵压缩存储”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "矩阵压缩存储",
      "pdfPages": "PDF第163-191页（书中第146-174页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nmap<pair<int,int>,int> multiplySparse(const vector<tuple<int,int,int>>& a,const vector<tuple<int,int,int>>& b){ map<pair<int,int>,int> c; for(auto [r,k,x]:a) for(auto [k2,col,y]:b) if(k==k2) c[{r,col}]+=x*y; return c; }"
  }
];
