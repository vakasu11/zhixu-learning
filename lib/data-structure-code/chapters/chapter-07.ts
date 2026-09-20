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
    "code": "struct Term { int row, col, value; };\n\nvector<Term> fastTranspose(const vector<Term>& a, int cols) {\n    vector<int> count(cols, 0), next(cols, 0);\n    for (auto& x : a) ++count[x.col];\n    for (int c = 1; c < cols; ++c) next[c] = next[c - 1] + count[c - 1];\n    vector<Term> b(a.size());\n    for (auto& x : a) b[next[x.col]++] = {x.col, x.row, x.value};\n    return b;\n}",
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
    "code": "int offset2D(int row, int col, int rows, int cols) {\n    if (row < 0 || row >= rows || col < 0 || col >= cols)\n        throw out_of_range(\"matrix index\");\n    return row * cols + col;\n}",
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
    "code": "int getTri(const vector<int>& lower, const vector<int>& diag,\n           const vector<int>& upper, int row, int col) {\n    if (row == col) return diag[row];\n    if (row == col + 1) return lower[col];\n    if (col == row + 1) return upper[row];\n    return 0;\n}",
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
  }
];
