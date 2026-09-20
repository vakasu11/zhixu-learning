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
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nTreeNode* insertBST(TreeNode* root, int value) {\n    if (!root) return new TreeNode{value, nullptr, nullptr};\n    if (value < root->value) root->left = insertBST(root->left, value);\n    else if (value > root->value) root->right = insertBST(root->right, value);\n    return root;\n}\n\nTreeNode* searchBST(TreeNode* root, int value) {\n    while (root && root->value != value)\n        root = value < root->value ? root->left : root->right;\n    return root;\n}",
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
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nTreeNode* eraseBST(TreeNode* root, int key) {\n    if (!root) return nullptr;\n    if (key < root->value) root->left = eraseBST(root->left, key);\n    else if (key > root->value) root->right = eraseBST(root->right, key);\n    else {\n        if (!root->left) { auto r = root->right; delete root; return r; }\n        if (!root->right) { auto l = root->left; delete root; return l; }\n        TreeNode* next = root->right;\n        while (next->left) next = next->left;\n        root->value = next->value;\n        root->right = eraseBST(root->right, next->value);\n    }\n    return root;\n}",
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
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nTreeNode* selectByRank(TreeNode* root, int k) {\n    while (root) {\n        int leftSize = root->left ? root->left->size : 0;\n        if (k == leftSize) return root;\n        if (k < leftSize) root = root->left;\n        else { k -= leftSize + 1; root = root->right; }\n    }\n    return nullptr;\n}",
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
  },
  {
    "id": "duplicate-key-bst",
    "chapter": 14,
    "category": "搜索树",
    "title": "重复关键字搜索树：结点保存计数",
    "priority": "必会",
    "topicIds": [
      "ch14-topic-01"
    ],
    "prerequisites": [
      "二叉搜索树",
      "对应章节的数据结构"
    ],
    "purpose": "掌握重复关键字搜索树：结点保存计数的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“二叉搜索树”的输入与状态",
      "执行重复关键字搜索树：结点保存计数的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“二叉搜索树”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "二叉搜索树",
      "pdfPages": "PDF第355-375页（书中第338-358页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nstruct CountNode{int key,count{1};unique_ptr<CountNode>left,right;};\nvoid insertCount(unique_ptr<CountNode>& root,int key){if(!root)root=make_unique<CountNode>(CountNode{key});else if(key<root->key)insertCount(root->left,key);else if(key>root->key)insertCount(root->right,key);else ++root->count;}"
  },
  {
    "id": "histogram-bst",
    "chapter": 14,
    "category": "搜索树",
    "title": "直方图：搜索树累计频次",
    "priority": "必会",
    "topicIds": [
      "ch14-topic-02"
    ],
    "prerequisites": [
      "索引二叉搜索树",
      "对应章节的数据结构"
    ],
    "purpose": "掌握直方图：搜索树累计频次的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“索引二叉搜索树”的输入与状态",
      "执行直方图：搜索树累计频次的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“索引二叉搜索树”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "索引二叉搜索树",
      "pdfPages": "PDF第355-375页（书中第338-358页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nmap<int,size_t> histogram(const vector<int>& values){map<int,size_t> frequencies;for(int value:values)++frequencies[value];return frequencies;}"
  },
  {
    "id": "best-fit-packing-bst",
    "chapter": 14,
    "category": "搜索树",
    "title": "最佳匹配装箱：按剩余容量搜索",
    "priority": "必会",
    "topicIds": [
      "ch14-topic-03"
    ],
    "prerequisites": [
      "BST 搜索、插入与删除",
      "对应章节的数据结构"
    ],
    "purpose": "掌握最佳匹配装箱：按剩余容量搜索的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“BST 搜索、插入与删除”的输入与状态",
      "执行最佳匹配装箱：按剩余容量搜索的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“BST 搜索、插入与删除”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "BST 搜索、插入与删除",
      "pdfPages": "PDF第355-375页（书中第338-358页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nvector<int> bestFitPacking(const vector<int>& objects,int capacity){multimap<int,int>spaces;vector<int>bin;int next=0;for(int size:objects){auto it=spaces.lower_bound(size);int id,space;if(it==spaces.end()){id=next++;space=capacity;}else{id=it->second;space=it->first;spaces.erase(it);}if(size>space)throw invalid_argument(\"oversized object\");spaces.emplace(space-size,id);bin.push_back(id);}return bin;}"
  },
  {
    "id": "cross-distribution",
    "chapter": 14,
    "category": "搜索树",
    "title": "交叉分布：按关键字交替分组",
    "priority": "重点理解",
    "topicIds": [
      "ch14-topic-04"
    ],
    "prerequisites": [
      "重复关键字处理",
      "对应章节的数据结构"
    ],
    "purpose": "掌握交叉分布：按关键字交替分组的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“重复关键字处理”的输入与状态",
      "执行交叉分布：按关键字交替分组的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“重复关键字处理”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "重复关键字处理",
      "pdfPages": "PDF第355-375页（书中第338-358页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\npair<vector<int>,vector<int>> crossDistribute(vector<int> values){sort(values.begin(),values.end());pair<vector<int>,vector<int>>out;for(size_t i=0;i<values.size();++i)(i%2?out.second:out.first).push_back(values[i]);return out;}"
  }
];
