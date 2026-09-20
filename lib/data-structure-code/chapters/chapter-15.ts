import type { CodeReviewItem } from "../types.ts";

export const chapter15Code: CodeReviewItem[] = [
  {
    "id": "avl-rotation",
    "chapter": 15,
    "title": "AVL 树：右旋骨架",
    "priority": "必会",
    "purpose": "用局部旋转恢复高度平衡，同时保持搜索树中序次序。",
    "complexity": "单次旋转 O(1)，插入/删除 O(log n)。",
    "invariant": "旋转前后中序序列不变，受影响节点高度正确。",
    "pitfalls": [
      "先更新旧根高度再更新新根",
      "LR/RL 需要两次旋转"
    ],
    "code": "int height(Node* x) { return x ? x->height : 0; }\n\nNode* rotateRight(Node* y) {\n    Node* x = y->left;\n    Node* middle = x->right;\n    x->right = y;\n    y->left = middle;\n    y->height = 1 + max(height(y->left), height(y->right));\n    x->height = 1 + max(height(x->left), height(x->right));\n    return x;\n}",
    "category": "平衡搜索树",
    "topicIds": [
      "ch15-topic-02"
    ],
    "prerequisites": [
      "AVL 旋转",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“AVL 旋转”所需的初始状态",
      "按不变式执行“AVL 树：右旋骨架”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "AVL 旋转",
      "pdfPages": "PDF第376-406页（书中第359-389页）"
    }
  },
  {
    "id": "avl-rebalance",
    "chapter": 15,
    "title": "AVL 插入后的四种平衡修复",
    "priority": "必会",
    "purpose": "根据平衡因子和插入方向选择 LL、RR、LR、RL 旋转。",
    "complexity": "沿搜索路径修复，总体 O(log n)。",
    "invariant": "返回的子树同时满足 BST 次序与 |balance|≤1。",
    "pitfalls": [
      "旋转前先判断内外侧",
      "每层返回前更新高度"
    ],
    "code": "Node* rebalance(Node* root) {\n    updateHeight(root);\n    int balance = height(root->left) - height(root->right);\n    if (balance > 1) {\n        if (height(root->left->left) < height(root->left->right))\n            root->left = rotateLeft(root->left);\n        return rotateRight(root);\n    }\n    if (balance < -1) {\n        if (height(root->right->right) < height(root->right->left))\n            root->right = rotateRight(root->right);\n        return rotateLeft(root);\n    }\n    return root;\n}",
    "category": "平衡搜索树",
    "topicIds": [
      "ch15-topic-01"
    ],
    "prerequisites": [
      "AVL 树",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“AVL 树”所需的初始状态",
      "按不变式执行“AVL 插入后的四种平衡修复”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "AVL 树",
      "pdfPages": "PDF第376-406页（书中第359-389页）"
    }
  },
  {
    "id": "red-black-insert-fix",
    "chapter": 15,
    "title": "红黑树插入修复骨架",
    "priority": "重点理解",
    "purpose": "通过重新着色与旋转消除红色父子冲突，同时保持黑高。",
    "complexity": "插入与修复 O(log n)。",
    "invariant": "循环开始时只有当前节点与父节点可能形成红红冲突。",
    "pitfalls": [
      "父节点为黑立即结束",
      "叔叔为红先变色",
      "左右情形必须镜像处理"
    ],
    "code": "while (node != root && color(node->parent) == RED) {\n    Node* parent = node->parent;\n    Node* grand = parent->parent;\n    Node* uncle = grand->right;\n    if (color(uncle) == RED) {\n        setBlack(parent); setBlack(uncle); setRed(grand);\n        node = grand;\n    } else {\n        if (node == parent->right) { node = parent; rotateLeft(node); }\n        setBlack(node->parent); setRed(grand);\n        rotateRight(grand);\n    }\n}\nsetBlack(root);",
    "category": "平衡搜索树",
    "topicIds": [
      "ch15-topic-04"
    ],
    "prerequisites": [
      "红黑树插入与删除",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“红黑树插入与删除”所需的初始状态",
      "按不变式执行“红黑树插入修复骨架”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "红黑树插入与删除",
      "pdfPages": "PDF第376-406页（书中第359-389页）"
    }
  }
];
