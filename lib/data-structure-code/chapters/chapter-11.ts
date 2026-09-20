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
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nstruct TreeNode { int value; TreeNode *left, *right; };\n\nvoid inorder(TreeNode* root) {\n    if (!root) return;\n    inorder(root->left);\n    cout << root->value << ' ';\n    inorder(root->right);\n}",
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
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nvector<vector<int>> levelOrder(TreeNode* root) {\n    vector<vector<int>> ans;\n    if (!root) return ans;\n    queue<TreeNode*> q; q.push(root);\n    while (!q.empty()) {\n        int count = q.size(); ans.push_back({});\n        while (count--) {\n            TreeNode* x = q.front(); q.pop();\n            ans.back().push_back(x->value);\n            if (x->left) q.push(x->left);\n            if (x->right) q.push(x->right);\n        }\n    }\n    return ans;\n}",
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
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nint treeHeight(TreeNode* root) {\n    if (!root) return 0;\n    return 1 + max(treeHeight(root->left), treeHeight(root->right));\n}\n\nint nodeCount(TreeNode* root) {\n    if (!root) return 0;\n    return 1 + nodeCount(root->left) + nodeCount(root->right);\n}",
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
  },
  {
    "id": "array-binary-tree",
    "chapter": 11,
    "category": "树结构",
    "title": "二叉树数组表示：父子下标映射",
    "priority": "必会",
    "topicIds": [
      "ch11-topic-01"
    ],
    "prerequisites": [
      "树的基本概念",
      "对应章节的数据结构"
    ],
    "purpose": "掌握二叉树数组表示：父子下标映射的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“树的基本概念”的输入与状态",
      "执行二叉树数组表示：父子下标映射的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“树的基本概念”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "树的基本概念",
      "pdfPages": "PDF第287-313页（书中第270-296页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\ntemplate<class T>\nclass ArrayBinaryTree { vector<optional<T>> nodes_; public: explicit ArrayBinaryTree(size_t n):nodes_(n){} void set(size_t i,T value){if(i>=nodes_.size())throw out_of_range(\"node\");nodes_[i]=move(value);} optional<T> left(size_t i)const{size_t child=2*i+1;return child<nodes_.size()?nodes_[child]:nullopt;} };"
  },
  {
    "id": "linked-binary-tree",
    "chapter": 11,
    "category": "树结构",
    "title": "链式二叉树：unique_ptr 所有权",
    "priority": "必会",
    "topicIds": [
      "ch11-topic-02"
    ],
    "prerequisites": [
      "二叉树",
      "对应章节的数据结构"
    ],
    "purpose": "掌握链式二叉树：unique_ptr 所有权的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“二叉树”的输入与状态",
      "执行链式二叉树：unique_ptr 所有权的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“二叉树”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "二叉树",
      "pdfPages": "PDF第287-313页（书中第270-296页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nstruct TreeNode { int value; unique_ptr<TreeNode> left,right; };\nunique_ptr<TreeNode> makeTree(int root){ return make_unique<TreeNode>(TreeNode{root,nullptr,nullptr}); }"
  },
  {
    "id": "iterative-tree-traversals",
    "chapter": 11,
    "category": "树结构",
    "title": "非递归遍历：显式栈实现中序",
    "priority": "必会",
    "topicIds": [
      "ch11-topic-03"
    ],
    "prerequisites": [
      "二叉树的特性",
      "对应章节的数据结构"
    ],
    "purpose": "掌握非递归遍历：显式栈实现中序的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“二叉树的特性”的输入与状态",
      "执行非递归遍历：显式栈实现中序的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“二叉树的特性”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "二叉树的特性",
      "pdfPages": "PDF第287-313页（书中第270-296页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nstruct Node{int value;Node* left{};Node* right{};};\nvector<int> iterativeInorder(Node* root){vector<int> out;stack<Node*> path;while(root||!path.empty()){while(root){path.push(root);root=root->left;}root=path.top();path.pop();out.push_back(root->value);root=root->right;}return out;}"
  },
  {
    "id": "tree-copy-and-equality",
    "chapter": 11,
    "category": "树结构",
    "title": "二叉树复制与相等判断",
    "priority": "重点理解",
    "topicIds": [
      "ch11-topic-04"
    ],
    "prerequisites": [
      "二叉树的数组与链式描述",
      "对应章节的数据结构"
    ],
    "purpose": "掌握二叉树复制与相等判断的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“二叉树的数组与链式描述”的输入与状态",
      "执行二叉树复制与相等判断的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“二叉树的数组与链式描述”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "二叉树的数组与链式描述",
      "pdfPages": "PDF第287-313页（书中第270-296页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nstruct CopyNode{int value;unique_ptr<CopyNode> left,right;};\nunique_ptr<CopyNode> clone(const CopyNode* n){if(!n)return nullptr;return make_unique<CopyNode>(CopyNode{n->value,clone(n->left.get()),clone(n->right.get())});}\nbool equal(const CopyNode* a,const CopyNode* b){return (!a&&!b)||(a&&b&&a->value==b->value&&equal(a->left.get(),b->left.get())&&equal(a->right.get(),b->right.get()));}"
  }
];
