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
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nint height(Node* x) { return x ? x->height : 0; }\n\nNode* rotateRight(Node* y) {\n    Node* x = y->left;\n    Node* middle = x->right;\n    x->right = y;\n    y->left = middle;\n    y->height = 1 + max(height(y->left), height(y->right));\n    x->height = 1 + max(height(x->left), height(x->right));\n    return x;\n}",
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
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nNode* rebalance(Node* root) {\n    updateHeight(root);\n    int balance = height(root->left) - height(root->right);\n    if (balance > 1) {\n        if (height(root->left->left) < height(root->left->right))\n            root->left = rotateLeft(root->left);\n        return rotateRight(root);\n    }\n    if (balance < -1) {\n        if (height(root->right->right) < height(root->right->left))\n            root->right = rotateRight(root->right);\n        return rotateLeft(root);\n    }\n    return root;\n}",
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
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nwhile (node != root && color(node->parent) == RED) {\n    Node* parent = node->parent;\n    Node* grand = parent->parent;\n    Node* uncle = grand->right;\n    if (color(uncle) == RED) {\n        setBlack(parent); setBlack(uncle); setRed(grand);\n        node = grand;\n    } else {\n        if (node == parent->right) { node = parent; rotateLeft(node); }\n        setBlack(node->parent); setRed(grand);\n        rotateRight(grand);\n    }\n}\nsetBlack(root);",
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
  },
  {
    "id": "avl-delete",
    "chapter": 15,
    "category": "平衡搜索树",
    "title": "AVL 删除：回溯更新高度并旋转",
    "priority": "必会",
    "topicIds": [
      "ch15-topic-01"
    ],
    "prerequisites": [
      "AVL 树",
      "对应章节的数据结构"
    ],
    "purpose": "掌握AVL 删除：回溯更新高度并旋转的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“AVL 树”的输入与状态",
      "执行AVL 删除：回溯更新高度并旋转的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“AVL 树”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "AVL 树",
      "pdfPages": "PDF第376-406页（书中第359-389页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nstruct Avl{int key,height{1};unique_ptr<Avl>left,right;};\nint height(const unique_ptr<Avl>&n){return n?n->height:0;}void update(Avl&n){n.height=1+max(height(n.left),height(n.right));}\nunique_ptr<Avl> rotateRight(unique_ptr<Avl> y){auto x=move(y->left);y->left=move(x->right);update(*y);x->right=move(y);update(*x);return x;}"
  },
  {
    "id": "red-black-delete",
    "chapter": 15,
    "category": "平衡搜索树",
    "title": "红黑树删除：双黑修复的兄弟旋转",
    "priority": "必会",
    "topicIds": [
      "ch15-topic-02"
    ],
    "prerequisites": [
      "AVL 旋转",
      "对应章节的数据结构"
    ],
    "purpose": "掌握红黑树删除：双黑修复的兄弟旋转的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“AVL 旋转”的输入与状态",
      "执行红黑树删除：双黑修复的兄弟旋转的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“AVL 旋转”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "AVL 旋转",
      "pdfPages": "PDF第376-406页（书中第359-389页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nenum class Color{red,black};struct RB{int key;Color color{Color::red};RB*parent{};RB*left{};RB*right{};};\nvoid recolorSibling(RB* parent,RB* sibling){if(!parent||!sibling)return;sibling->color=Color::red;if(parent->color==Color::red)parent->color=Color::black;}"
  },
  {
    "id": "splay-tree",
    "chapter": 15,
    "category": "平衡搜索树",
    "title": "伸展树：访问后旋至根",
    "priority": "必会",
    "topicIds": [
      "ch15-topic-03"
    ],
    "prerequisites": [
      "红黑树",
      "对应章节的数据结构"
    ],
    "purpose": "掌握伸展树：访问后旋至根的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“红黑树”的输入与状态",
      "执行伸展树：访问后旋至根的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“红黑树”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "红黑树",
      "pdfPages": "PDF第376-406页（书中第359-389页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nstruct Splay{int key;unique_ptr<Splay>left,right;};\nunique_ptr<Splay> rotateRightSplay(unique_ptr<Splay>root){auto pivot=move(root->left);root->left=move(pivot->right);pivot->right=move(root);return pivot;}\nunique_ptr<Splay> splay(unique_ptr<Splay>root,int key){if(!root||root->key==key)return root;if(key<root->key&&root->left)root=rotateRightSplay(move(root));return root;}"
  },
  {
    "id": "b-tree-search",
    "chapter": 15,
    "category": "平衡搜索树",
    "title": "B 树查找：在结点内二分定位",
    "priority": "重点理解",
    "topicIds": [
      "ch15-topic-04"
    ],
    "prerequisites": [
      "红黑树插入与删除",
      "对应章节的数据结构"
    ],
    "purpose": "掌握B 树查找：在结点内二分定位的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“红黑树插入与删除”的输入与状态",
      "执行B 树查找：在结点内二分定位的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“红黑树插入与删除”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "红黑树插入与删除",
      "pdfPages": "PDF第376-406页（书中第359-389页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nstruct BNode{bool leaf;vector<int>keys;vector<unique_ptr<BNode>>children;};\nbool btreeContains(const BNode* node,int key){while(node){auto it=lower_bound(node->keys.begin(),node->keys.end(),key);size_t i=it-node->keys.begin();if(it!=node->keys.end()&&*it==key)return true;if(node->leaf)return false;node=node->children[i].get();}return false;}"
  },
  {
    "id": "b-tree-insert",
    "chapter": 15,
    "category": "平衡搜索树",
    "title": "B 树插入：满孩子先分裂",
    "priority": "重点理解",
    "topicIds": [
      "ch15-topic-05"
    ],
    "prerequisites": [
      "分裂树",
      "对应章节的数据结构"
    ],
    "purpose": "掌握B 树插入：满孩子先分裂的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“分裂树”的输入与状态",
      "执行B 树插入：满孩子先分裂的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“分裂树”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "分裂树",
      "pdfPages": "PDF第376-406页（书中第359-389页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nstruct BPage{bool leaf;vector<int>keys;vector<unique_ptr<BPage>>child;};\nvoid insertIntoLeaf(BPage& page,int key){auto it=lower_bound(page.keys.begin(),page.keys.end(),key);page.keys.insert(it,key);}"
  },
  {
    "id": "b-tree-delete",
    "chapter": 15,
    "category": "平衡搜索树",
    "title": "B 树删除：下降前保证孩子有余量",
    "priority": "重点理解",
    "topicIds": [
      "ch15-topic-06"
    ],
    "prerequisites": [
      "B 树",
      "对应章节的数据结构"
    ],
    "purpose": "掌握B 树删除：下降前保证孩子有余量的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“B 树”的输入与状态",
      "执行B 树删除：下降前保证孩子有余量的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“B 树”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "B 树",
      "pdfPages": "PDF第376-406页（书中第359-389页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nbool eraseLeafKey(vector<int>& keys,int key){auto it=lower_bound(keys.begin(),keys.end(),key);if(it==keys.end()||*it!=key)return false;keys.erase(it);return true;}"
  }
];
