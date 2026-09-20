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
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nint findSlot(const vector<optional<pair<int,int>>>& table, int key) {\n    int n = table.size(), start = (key % n + n) % n;\n    for (int step = 0; step < n; ++step) {\n        int i = (start + step) % n;\n        if (!table[i]) return -1;\n        if (table[i]->first == key) return i;\n    }\n    return -1;\n}",
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
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nclass ChainedHash {\n    vector<list<pair<int,int>>> bucket;\npublic:\n    explicit ChainedHash(int n) : bucket(n) {}\n    void put(int key, int value) {\n        auto& chain = bucket[(key % bucket.size() + bucket.size()) % bucket.size()];\n        for (auto& [k, v] : chain) if (k == key) { v = value; return; }\n        chain.push_front({key, value});\n    }\n};",
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
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nSkipNode* search(SkipNode* head, int key) {\n    SkipNode* current = head;\n    for (int level = maxLevel; level >= 0; --level) {\n        while (current->next[level] &&\n               current->next[level]->key < key)\n            current = current->next[level];\n    }\n    current = current->next[0];\n    return current && current->key == key ? current : nullptr;\n}",
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
  },
  {
    "id": "sorted-dictionary",
    "chapter": 10,
    "category": "字典与散列",
    "title": "有序字典：二分查找与插入",
    "priority": "必会",
    "topicIds": [
      "ch10-topic-01"
    ],
    "prerequisites": [
      "字典抽象数据类型",
      "对应章节的数据结构"
    ],
    "purpose": "掌握有序字典：二分查找与插入的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“字典抽象数据类型”的输入与状态",
      "执行有序字典：二分查找与插入的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“字典抽象数据类型”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "字典抽象数据类型",
      "pdfPages": "PDF第252-286页（书中第235-269页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nclass SortedDictionary { vector<pair<int,string>> data_; public: optional<string> find(int key)const{auto it=lower_bound(data_.begin(),data_.end(),key,[](auto& p,int k){return p.first<k;});return it!=data_.end()&&it->first==key?optional<string>(it->second):nullopt;} void set(int key,string value){auto it=lower_bound(data_.begin(),data_.end(),key,[](auto& p,int k){return p.first<k;});if(it!=data_.end()&&it->first==key)it->second=move(value);else data_.insert(it,{key,move(value)});} };"
  },
  {
    "id": "skip-list-update",
    "chapter": 10,
    "category": "字典与散列",
    "title": "跳表更新：记录搜索路径后插入",
    "priority": "必会",
    "topicIds": [
      "ch10-topic-02"
    ],
    "prerequisites": [
      "有序线性表",
      "对应章节的数据结构"
    ],
    "purpose": "掌握跳表更新：记录搜索路径后插入的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“有序线性表”的输入与状态",
      "执行跳表更新：记录搜索路径后插入的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“有序线性表”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "有序线性表",
      "pdfPages": "PDF第252-286页（书中第235-269页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nstruct SkipNode{int key;vector<SkipNode*> next;};\nvoid linkNewNode(vector<SkipNode*>& update,SkipNode* node){ for(size_t level=0;level<node->next.size();++level){node->next[level]=update[level]->next[level];update[level]->next[level]=node;} }"
  },
  {
    "id": "division-hash",
    "chapter": 10,
    "category": "字典与散列",
    "title": "除法散列：处理负关键字",
    "priority": "必会",
    "topicIds": [
      "ch10-topic-03"
    ],
    "prerequisites": [
      "跳表",
      "对应章节的数据结构"
    ],
    "purpose": "掌握除法散列：处理负关键字的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“跳表”的输入与状态",
      "执行除法散列：处理负关键字的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“跳表”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "跳表",
      "pdfPages": "PDF第252-286页（书中第235-269页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nsize_t divisionHash(long long key,size_t tableSize){ if(tableSize==0) throw invalid_argument(\"table size\"); long long r=key%static_cast<long long>(tableSize); return static_cast<size_t>(r<0?r+tableSize:r); }"
  },
  {
    "id": "lzw-encode",
    "chapter": 10,
    "category": "字典与散列",
    "title": "LZW 编码：动态扩展短语字典",
    "priority": "重点理解",
    "topicIds": [
      "ch10-topic-04"
    ],
    "prerequisites": [
      "散列函数与散列表",
      "对应章节的数据结构"
    ],
    "purpose": "掌握LZW 编码：动态扩展短语字典的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“散列函数与散列表”的输入与状态",
      "执行LZW 编码：动态扩展短语字典的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“散列函数与散列表”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "散列函数与散列表",
      "pdfPages": "PDF第252-286页（书中第235-269页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nvector<int> lzwEncode(const string& text){ unordered_map<string,int> dict; for(int i=0;i<256;++i)dict[string(1,char(i))]=i; vector<int> out; string phrase; int next=256; for(unsigned char ch:text){string candidate=phrase+char(ch);if(dict.find(candidate)!=dict.end())phrase=candidate;else{if(!phrase.empty())out.push_back(dict.at(phrase));dict[candidate]=next++;phrase=string(1,char(ch));}}if(!phrase.empty())out.push_back(dict.at(phrase));return out; }"
  },
  {
    "id": "lzw-decode",
    "chapter": 10,
    "category": "字典与散列",
    "title": "LZW 解码：处理 nextCode 特例",
    "priority": "重点理解",
    "topicIds": [
      "ch10-topic-05"
    ],
    "prerequisites": [
      "线性探查",
      "对应章节的数据结构"
    ],
    "purpose": "掌握LZW 解码：处理 nextCode 特例的状态表示、核心更新与边界处理。",
    "steps": [
      "确定“线性探查”的输入与状态",
      "执行LZW 解码：处理 nextCode 特例的核心更新",
      "检查边界条件并返回结果"
    ],
    "complexity": "复杂度由代码中的循环、递归深度或容器操作共同决定，复习时逐行计数。",
    "invariant": "每次核心更新后，“线性探查”的结构约束仍成立。",
    "pitfalls": [
      "先处理空输入与越界情况",
      "更新多个指针或状态时保持顺序一致",
      "不要把示例中的边界检查省略"
    ],
    "textbookRef": {
      "section": "线性探查",
      "pdfPages": "PDF第252-286页（书中第235-269页）"
    },
    "code": "#include <algorithm>\n#include <array>\n#include <cassert>\n#include <chrono>\n#include <cmath>\n#include <cstddef>\n#include <functional>\n#include <limits>\n#include <list>\n#include <map>\n#include <memory>\n#include <numeric>\n#include <optional>\n#include <queue>\n#include <random>\n#include <set>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <tuple>\n#include <unordered_map>\n#include <utility>\n#include <vector>\nusing namespace std;\n\nstring lzwDecode(const vector<int>& codes){ if(codes.empty())return {}; vector<string> dict(256);for(int i=0;i<256;++i)dict[i]=string(1,char(i));string previous=dict.at(codes[0]),out=previous;for(size_t i=1;i<codes.size();++i){int code=codes[i];string entry;if(code<int(dict.size()))entry=dict[code];else if(code==int(dict.size()))entry=previous+previous.front();else throw runtime_error(\"invalid LZW code\");out+=entry;dict.push_back(previous+entry.front());previous=entry;}return out; }"
  }
];
