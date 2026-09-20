import type { CodeReviewItem } from "../types.ts";

export const chapter05Code: CodeReviewItem[] = [
  {
    "id": "array-resize",
    "chapter": 5,
    "title": "变长数组：容量倍增",
    "priority": "必会",
    "purpose": "掌握申请新空间、迁移元素、释放旧空间和更新指针。",
    "complexity": "单次扩容 O(n)；倍增策略下尾部追加均摊 O(1)。",
    "invariant": "迁移后前 size 个元素的值与顺序不变。",
    "pitfalls": [
      "先迁移再 delete[]",
      "size 与 capacity 含义不同",
      "工程中优先 vector"
    ],
    "code": "template<class T>\nvoid grow(T*& data, int size, int& capacity) {\n    int nextCapacity = max(1, capacity * 2);\n    T* next = new T[nextCapacity];\n    move(data, data + size, next);\n    delete[] data;\n    data = next;\n    capacity = nextCapacity;\n}",
    "category": "数组线性表",
    "topicIds": [
      "ch05-topic-03"
    ],
    "prerequisites": [
      "变长数组",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“变长数组”所需的初始状态",
      "按不变式执行“变长数组：容量倍增”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "变长数组",
      "pdfPages": "PDF第109-129页（书中第92-112页）"
    }
  },
  {
    "id": "array-list-edit",
    "chapter": 5,
    "title": "arrayList 的插入与删除",
    "priority": "必会",
    "purpose": "掌握数组线性表的移动方向和合法下标范围。",
    "complexity": "插入、删除最坏 O(n)；按下标访问 O(1)。",
    "invariant": "插入从后向前搬移，删除从前向后覆盖，尚未读取的数据不会被破坏。",
    "pitfalls": [
      "插入位置可等于 size，删除位置不可",
      "插入必须从尾部向右移动",
      "成功后再修改 size"
    ],
    "code": "template<class T>\nvoid insertAt(T* a, int& size, int capacity, int index, const T& value) {\n    if (index < 0 || index > size || size == capacity) throw out_of_range(\"insert\");\n    move_backward(a + index, a + size, a + size + 1);\n    a[index] = value;\n    ++size;\n}\n\ntemplate<class T>\nvoid eraseAt(T* a, int& size, int index) {\n    if (index < 0 || index >= size) throw out_of_range(\"erase\");\n    move(a + index + 1, a + size, a + index);\n    --size;\n}",
    "category": "数组线性表",
    "topicIds": [
      "ch05-topic-04"
    ],
    "prerequisites": [
      "arrayList",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“arrayList”所需的初始状态",
      "按不变式执行“arrayList 的插入与删除”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "arrayList",
      "pdfPages": "PDF第109-129页（书中第92-112页）"
    }
  },
  {
    "id": "array-iterator",
    "chapter": 5,
    "title": "arrayList 随机访问迭代器",
    "priority": "重点理解",
    "purpose": "把底层指针包装成 begin/end 接口，使线性表可用于范围循环和标准算法。",
    "complexity": "解引用、递增、比较均为 O(1)。",
    "invariant": "迭代器始终指向当前元素或尾后位置。",
    "pitfalls": [
      "end 指向尾后位置，不能解引用",
      "扩容会使旧迭代器失效"
    ],
    "code": "template<class T>\nclass ArrayIterator {\n    T* position;\npublic:\n    explicit ArrayIterator(T* p = nullptr) : position(p) {}\n    T& operator*() const { return *position; }\n    ArrayIterator& operator++() { ++position; return *this; }\n    bool operator!=(const ArrayIterator& other) const {\n        return position != other.position;\n    }\n};",
    "category": "数组线性表",
    "topicIds": [
      "ch05-topic-05"
    ],
    "prerequisites": [
      "C++ 迭代器",
      "对应章节的抽象数据类型"
    ],
    "steps": [
      "根据输入建立“C++ 迭代器”所需的初始状态",
      "按不变式执行“arrayList 随机访问迭代器”的核心更新",
      "返回结果并检查边界条件"
    ],
    "textbookRef": {
      "section": "C++ 迭代器",
      "pdfPages": "PDF第109-129页（书中第92-112页）"
    }
  }
];
