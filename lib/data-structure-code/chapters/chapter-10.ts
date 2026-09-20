import type { CodeReviewItem } from "../types.ts";

export const chapter10Code: CodeReviewItem[] = [
  {
    "id": "linear-probing",
    "chapter": 10,
    "title": "散列表：线性探查查找",
    "priority": "必会",
    "purpose": "理解冲突、探查序列、装载因子与删除标记。",
    "complexity": "期望 O(1)，最坏 O(n)。",
    "invariant": "从哈希位置开始，直到找到键或遇到从未使用的空槽。",
    "pitfalls": [
      "删除不能直接变成从未使用",
      "高装载因子要扩容再散列"
    ],
    "code": "int findSlot(const vector<optional<pair<int,int>>>& table, int key) {\n    int n = table.size(), start = (key % n + n) % n;\n    for (int step = 0; step < n; ++step) {\n        int i = (start + step) % n;\n        if (!table[i]) return -1;\n        if (table[i]->first == key) return i;\n    }\n    return -1;\n}",
    "category": "字典与散列",
    "topicIds": [
      "ch10-topic-05"
    ],
    "prerequisites": [
      "线性探查",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“线性探查”所需的初始状态",
      "按不变式执行“散列表：线性探查查找”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "线性探查",
      "pdfPages": "PDF第252-286页（书中第235-269页）"
    }
  },
  {
    "id": "chained-hash",
    "chapter": 10,
    "title": "散列表：链式散列",
    "priority": "必会",
    "purpose": "每个桶保存冲突键的链表，删除不会破坏其他键的查找路径。",
    "complexity": "期望 O(1)，最坏 O(n)。",
    "invariant": "键只可能存在于 hash(key) 对应的桶中。",
    "pitfalls": [
      "桶数与哈希函数共同影响分布",
      "装载因子过高仍需扩容"
    ],
    "code": "class ChainedHash {\n    vector<list<pair<int,int>>> bucket;\npublic:\n    explicit ChainedHash(int n) : bucket(n) {}\n    void put(int key, int value) {\n        auto& chain = bucket[(key % bucket.size() + bucket.size()) % bucket.size()];\n        for (auto& [k, v] : chain) if (k == key) { v = value; return; }\n        chain.push_front({key, value});\n    }\n};",
    "category": "字典与散列",
    "topicIds": [
      "ch10-topic-06"
    ],
    "prerequisites": [
      "链式散列",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“链式散列”所需的初始状态",
      "按不变式执行“散列表：链式散列”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "链式散列",
      "pdfPages": "PDF第252-286页（书中第235-269页）"
    }
  },
  {
    "id": "skip-list-search",
    "chapter": 10,
    "title": "跳表查找：向右再向下",
    "priority": "重点理解",
    "purpose": "利用多层索引跳过大量节点，在有序字典中快速定位。",
    "complexity": "期望 O(log n)，最坏 O(n)。",
    "invariant": "每层移动后当前位置键小于目标，下一节点键不小于目标。",
    "pitfalls": [
      "最底层才确认是否命中",
      "随机层高决定期望性能"
    ],
    "code": "SkipNode* search(SkipNode* head, int key) {\n    SkipNode* current = head;\n    for (int level = maxLevel; level >= 0; --level) {\n        while (current->next[level] &&\n               current->next[level]->key < key)\n            current = current->next[level];\n    }\n    current = current->next[0];\n    return current && current->key == key ? current : nullptr;\n}",
    "category": "字典与散列",
    "topicIds": [
      "ch10-topic-03"
    ],
    "prerequisites": [
      "跳表",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“跳表”所需的初始状态",
      "按不变式执行“跳表查找：向右再向下”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "跳表",
      "pdfPages": "PDF第252-286页（书中第235-269页）"
    }
  }
];
