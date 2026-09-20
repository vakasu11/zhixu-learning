import type { CodeReviewItem } from "../types.ts";

export const chapter14Code: CodeReviewItem[] = [
  {
    "id": "bst",
    "chapter": 14,
    "title": "二叉搜索树的搜索与插入",
    "priority": "必会",
    "purpose": "利用左小右大逐层缩小搜索范围。",
    "complexity": "平均 O(log n)，退化时 O(n)。",
    "invariant": "任一节点左子树键更小、右子树键更大。",
    "pitfalls": [
      "递归插入要接回子树根",
      "有序输入可能导致退化"
    ],
    "code": "TreeNode* insertBST(TreeNode* root, int value) {\n    if (!root) return new TreeNode{value, nullptr, nullptr};\n    if (value < root->value) root->left = insertBST(root->left, value);\n    else if (value > root->value) root->right = insertBST(root->right, value);\n    return root;\n}\n\nTreeNode* searchBST(TreeNode* root, int value) {\n    while (root && root->value != value)\n        root = value < root->value ? root->left : root->right;\n    return root;\n}",
    "category": "搜索树",
    "topicIds": [
      "ch14-topic-01"
    ],
    "prerequisites": [
      "二叉搜索树",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“二叉搜索树”所需的初始状态",
      "按不变式执行“二叉搜索树的搜索与插入”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "二叉搜索树",
      "pdfPages": "PDF第355-375页（书中第338-358页）"
    }
  },
  {
    "id": "bst-delete",
    "chapter": 14,
    "title": "二叉搜索树删除",
    "priority": "必会",
    "purpose": "分别处理叶子、单孩子和双孩子节点，并保持搜索树次序。",
    "complexity": "平均 O(log n)，最坏 O(n)。",
    "invariant": "删除后所有保留键的中序顺序不变。",
    "pitfalls": [
      "双孩子时用后继或前驱替换",
      "递归结果要重新接回父节点"
    ],
    "code": "TreeNode* eraseBST(TreeNode* root, int key) {\n    if (!root) return nullptr;\n    if (key < root->value) root->left = eraseBST(root->left, key);\n    else if (key > root->value) root->right = eraseBST(root->right, key);\n    else {\n        if (!root->left) { auto r = root->right; delete root; return r; }\n        if (!root->right) { auto l = root->left; delete root; return l; }\n        TreeNode* next = root->right;\n        while (next->left) next = next->left;\n        root->value = next->value;\n        root->right = eraseBST(root->right, next->value);\n    }\n    return root;\n}",
    "category": "搜索树",
    "topicIds": [
      "ch14-topic-03"
    ],
    "prerequisites": [
      "BST 搜索、插入与删除",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“BST 搜索、插入与删除”所需的初始状态",
      "按不变式执行“二叉搜索树删除”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "BST 搜索、插入与删除",
      "pdfPages": "PDF第355-375页（书中第338-358页）"
    }
  },
  {
    "id": "indexed-bst",
    "chapter": 14,
    "title": "索引 BST：按排名选择",
    "priority": "重点理解",
    "purpose": "在节点中维护左子树规模，支持第 k 小元素查询。",
    "complexity": "平衡时 O(log n)，退化时 O(n)。",
    "invariant": "node->size 等于以该节点为根的子树节点总数。",
    "pitfalls": [
      "插入和删除后都要更新 size",
      "k 的 0/1 起始约定要统一"
    ],
    "code": "TreeNode* selectByRank(TreeNode* root, int k) {\n    while (root) {\n        int leftSize = root->left ? root->left->size : 0;\n        if (k == leftSize) return root;\n        if (k < leftSize) root = root->left;\n        else { k -= leftSize + 1; root = root->right; }\n    }\n    return nullptr;\n}",
    "category": "搜索树",
    "topicIds": [
      "ch14-topic-05"
    ],
    "prerequisites": [
      "索引 BST",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“索引 BST”所需的初始状态",
      "按不变式执行“索引 BST：按排名选择”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "索引 BST",
      "pdfPages": "PDF第355-375页（书中第338-358页）"
    }
  }
];
