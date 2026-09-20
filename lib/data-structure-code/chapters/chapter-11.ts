import type { CodeReviewItem } from "../types.ts";

export const chapter11Code: CodeReviewItem[] = [
  {
    "id": "tree-traversal",
    "chapter": 11,
    "title": "二叉树递归遍历",
    "priority": "必会",
    "purpose": "一套骨架覆盖前序、中序和后序，也是树算法的基础。",
    "complexity": "时间 O(n)，递归栈 O(h)。",
    "invariant": "每个非空节点只处理一次；访问根的位置决定顺序。",
    "pitfalls": [
      "空指针是递归出口",
      "搜索树只有中序遍历天然有序"
    ],
    "code": "struct TreeNode { int value; TreeNode *left, *right; };\n\nvoid inorder(TreeNode* root) {\n    if (!root) return;\n    inorder(root->left);\n    cout << root->value << ' ';\n    inorder(root->right);\n}",
    "category": "树结构",
    "topicIds": [
      "ch11-topic-06"
    ],
    "prerequisites": [
      "二叉树遍历",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“二叉树遍历”所需的初始状态",
      "按不变式执行“二叉树递归遍历”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "二叉树遍历",
      "pdfPages": "PDF第287-313页（书中第270-296页）"
    }
  },
  {
    "id": "tree-level-order",
    "chapter": 11,
    "title": "二叉树层序遍历",
    "priority": "必会",
    "purpose": "用队列按层访问，可扩展到求层数和最短层级。",
    "complexity": "时间 O(n)，队列最坏空间 O(n)。",
    "invariant": "队列按从上到下、从左到右保存尚未访问节点。",
    "pitfalls": [
      "根为空直接返回",
      "分层时先保存当前队列长度"
    ],
    "code": "vector<vector<int>> levelOrder(TreeNode* root) {\n    vector<vector<int>> ans;\n    if (!root) return ans;\n    queue<TreeNode*> q; q.push(root);\n    while (!q.empty()) {\n        int count = q.size(); ans.push_back({});\n        while (count--) {\n            TreeNode* x = q.front(); q.pop();\n            ans.back().push_back(x->value);\n            if (x->left) q.push(x->left);\n            if (x->right) q.push(x->right);\n        }\n    }\n    return ans;\n}",
    "category": "树结构",
    "topicIds": [
      "ch11-topic-06"
    ],
    "prerequisites": [
      "二叉树遍历",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“二叉树遍历”所需的初始状态",
      "按不变式执行“二叉树层序遍历”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "二叉树遍历",
      "pdfPages": "PDF第287-313页（书中第270-296页）"
    }
  },
  {
    "id": "tree-statistics",
    "chapter": 11,
    "title": "二叉树高度与节点计数",
    "priority": "必会",
    "purpose": "利用相同递归结构聚合左右子树结果，是树上动态计算的基础。",
    "complexity": "时间 O(n)，递归栈 O(h)。",
    "invariant": "当前节点的答案只依赖左右子树已经正确返回的答案。",
    "pitfalls": [
      "空树高度采用 0 还是 -1 要统一",
      "每个节点只递归访问一次"
    ],
    "code": "int treeHeight(TreeNode* root) {\n    if (!root) return 0;\n    return 1 + max(treeHeight(root->left), treeHeight(root->right));\n}\n\nint nodeCount(TreeNode* root) {\n    if (!root) return 0;\n    return 1 + nodeCount(root->left) + nodeCount(root->right);\n}",
    "category": "树结构",
    "topicIds": [
      "ch11-topic-05"
    ],
    "prerequisites": [
      "二叉树常用操作",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“二叉树常用操作”所需的初始状态",
      "按不变式执行“二叉树高度与节点计数”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "二叉树常用操作",
      "pdfPages": "PDF第287-313页（书中第270-296页）"
    }
  }
];
