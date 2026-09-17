export type CodePriority = "必会" | "重点理解" | "拓展";

export type CodeReviewItem = {
  id: string;
  chapter: number;
  title: string;
  priority: CodePriority;
  purpose: string;
  complexity: string;
  invariant: string;
  pitfalls: string[];
  code: string;
};

export const DATA_STRUCTURE_CODE_LIBRARY = [
  {
    "id": "recursive-sum",
    "chapter": 1,
    "title": "递归求和：递归函数最小骨架",
    "priority": "重点理解",
    "purpose": "看懂递归出口、规模缩小和调用栈，为树遍历、分治与回溯打基础。",
    "complexity": "时间 O(n)，递归栈 O(n)。",
    "invariant": "每次调用把问题从前 n 个元素缩小为前 n-1 个元素。",
    "pitfalls": [
      "必须设置 n == 0 的出口",
      "递归过深可能栈溢出"
    ],
    "code": "template<class T>\nT recursiveSum(const T a[], int n) {\n    if (n == 0) return T{};\n    return recursiveSum(a, n - 1) + a[n - 1];\n}"
  },
  {
    "id": "sequential-search",
    "chapter": 2,
    "title": "顺序查找与操作计数",
    "priority": "必会",
    "purpose": "把循环次数与输入规模联系起来，理解最好、最坏和平均复杂度。",
    "complexity": "最好 O(1)，最坏 O(n)，平均 O(n)。",
    "invariant": "进入第 i 次比较前，[0, i) 中不存在目标。",
    "pitfalls": [
      "先约定失败返回值",
      "平均比较次数不是常数"
    ],
    "code": "template<class T>\nint sequentialSearch(const T a[], int n, const T& target) {\n    for (int i = 0; i < n; ++i)\n        if (a[i] == target) return i;\n    return -1;\n}"
  },
  {
    "id": "insertion-sort",
    "chapter": 2,
    "title": "插入排序：维护有序前缀",
    "priority": "必会",
    "purpose": "对比移动与交换，理解基础排序的循环不变量。",
    "complexity": "最好 O(n)，最坏 O(n²)，原地且稳定。",
    "invariant": "每轮开始时 a[0..i) 已有序。",
    "pitfalls": [
      "移动结束后才放回 key",
      "比较应使用严格大于以保持稳定"
    ],
    "code": "void insertionSort(vector<int>& a) {\n    for (int i = 1; i < (int)a.size(); ++i) {\n        int key = a[i], j = i - 1;\n        while (j >= 0 && a[j] > key) {\n            a[j + 1] = a[j];\n            --j;\n        }\n        a[j + 1] = key;\n    }\n}"
  },
  {
    "id": "binary-search",
    "chapter": 3,
    "title": "二分查找与闭区间边界",
    "priority": "必会",
    "purpose": "掌握 O(log n) 的典型来源，并训练不越界的边界收缩。",
    "complexity": "时间 O(log n)，额外空间 O(1)。",
    "invariant": "若目标存在，它始终在闭区间 [left, right] 内。",
    "pitfalls": [
      "只适用于有序序列",
      "更新边界必须越过 mid",
      "中点写法避免溢出"
    ],
    "code": "int binarySearch(const vector<int>& a, int target) {\n    int left = 0, right = (int)a.size() - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (a[mid] == target) return mid;\n        if (a[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}"
  },
  {
    "id": "benchmark",
    "chapter": 4,
    "title": "性能测量：重复运行与数据复原",
    "priority": "重点理解",
    "purpose": "正确测量算法时间，排除数据生成、输出与单次抖动。",
    "complexity": "测量成本约为重复次数乘以被测算法成本。",
    "invariant": "每轮算法获得相同规模、同分布的独立输入。",
    "pitfalls": [
      "计时范围不要包含输出",
      "一次运行太短不可靠",
      "比较时使用相同编译模式"
    ],
    "code": "template<class F>\ndouble benchmark(F algorithm, const vector<int>& source, int repeat) {\n    using Clock = chrono::steady_clock;\n    auto start = Clock::now();\n    for (int r = 0; r < repeat; ++r) {\n        auto data = source;\n        algorithm(data);\n    }\n    auto stop = Clock::now();\n    return chrono::duration<double, milli>(stop - start).count() / repeat;\n}"
  },
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
    "code": "template<class T>\nvoid grow(T*& data, int size, int& capacity) {\n    int nextCapacity = max(1, capacity * 2);\n    T* next = new T[nextCapacity];\n    move(data, data + size, next);\n    delete[] data;\n    data = next;\n    capacity = nextCapacity;\n}"
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
    "code": "template<class T>\nvoid insertAt(T* a, int& size, int capacity, int index, const T& value) {\n    if (index < 0 || index > size || size == capacity) throw out_of_range(\"insert\");\n    move_backward(a + index, a + size, a + size + 1);\n    a[index] = value;\n    ++size;\n}\n\ntemplate<class T>\nvoid eraseAt(T* a, int& size, int index) {\n    if (index < 0 || index >= size) throw out_of_range(\"erase\");\n    move(a + index + 1, a + size, a + index);\n    --size;\n}"
  },
  {
    "id": "singly-linked-list",
    "chapter": 6,
    "title": "单向链表：插入与删除",
    "priority": "必会",
    "purpose": "掌握指针重连顺序，以及链表随机访问为何是 O(n)。",
    "complexity": "已知前驱时 O(1)；按下标定位 O(n)。",
    "invariant": "修改后从头结点仍可按顺序访问所有保留节点。",
    "pitfalls": [
      "删除前保存待删节点",
      "头部操作可用虚拟头结点统一",
      "析构时先保存 next"
    ],
    "code": "struct Node { int value; Node* next; };\n\nvoid insertAfter(Node* prev, int value) {\n    if (!prev) throw invalid_argument(\"prev\");\n    prev->next = new Node{value, prev->next};\n}\n\nvoid eraseAfter(Node* prev) {\n    if (!prev || !prev->next) throw out_of_range(\"erase\");\n    Node* doomed = prev->next;\n    prev->next = doomed->next;\n    delete doomed;\n}"
  },
  {
    "id": "union-find",
    "chapter": 6,
    "title": "并查集：路径压缩与按秩合并",
    "priority": "必会",
    "purpose": "高效维护等价类，也是 Kruskal 算法的关键组件。",
    "complexity": "均摊 O(α(n))，实际接近常数。",
    "invariant": "每个集合有唯一根，根的 parent 指向自己。",
    "pitfalls": [
      "合并两个根而不是原始节点",
      "路径压缩要写回 parent",
      "等秩合并才增加 rank"
    ],
    "code": "struct DSU {\n    vector<int> parent, rank;\n    explicit DSU(int n) : parent(n), rank(n, 0) {\n        iota(parent.begin(), parent.end(), 0);\n    }\n    int find(int x) {\n        return parent[x] == x ? x : parent[x] = find(parent[x]);\n    }\n    bool unite(int a, int b) {\n        a = find(a); b = find(b);\n        if (a == b) return false;\n        if (rank[a] < rank[b]) swap(a, b);\n        parent[b] = a;\n        if (rank[a] == rank[b]) ++rank[a];\n        return true;\n    }\n};"
  },
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
    "code": "struct Term { int row, col, value; };\n\nvector<Term> fastTranspose(const vector<Term>& a, int cols) {\n    vector<int> count(cols, 0), next(cols, 0);\n    for (auto& x : a) ++count[x.col];\n    for (int c = 1; c < cols; ++c) next[c] = next[c - 1] + count[c - 1];\n    vector<Term> b(a.size());\n    for (auto& x : a) b[next[x.col]++] = {x.col, x.row, x.value};\n    return b;\n}"
  },
  {
    "id": "bracket-stack",
    "chapter": 8,
    "title": "栈应用：括号匹配",
    "priority": "必会",
    "purpose": "体现后进先出如何保存尚未配对的左括号。",
    "complexity": "时间 O(n)，空间 O(n)。",
    "invariant": "栈保存扫描前缀中尚未匹配的左括号。",
    "pitfalls": [
      "右括号出现时先判空",
      "扫描结束后栈必须为空"
    ],
    "code": "bool validBrackets(const string& s) {\n    stack<char> st;\n    for (char c : s) {\n        if (c == '(' || c == '[' || c == '{') st.push(c);\n        else if (c == ')' || c == ']' || c == '}') {\n            if (st.empty()) return false;\n            char left = st.top(); st.pop();\n            if ((left == '(' && c != ')') || (left == '[' && c != ']') ||\n                (left == '{' && c != '}')) return false;\n        }\n    }\n    return st.empty();\n}"
  },
  {
    "id": "circular-queue",
    "chapter": 9,
    "title": "循环队列：入队与出队",
    "priority": "必会",
    "purpose": "用取模复用数组前部空间，并区分队空与队满。",
    "complexity": "入队、出队均为 O(1)。",
    "invariant": "front 指向队首，(front + count) % capacity 指向入队位置。",
    "pitfalls": [
      "额外保存 count 或牺牲一个槽位",
      "下标移动必须取模"
    ],
    "code": "class CircularQueue {\n    vector<int> data; int front = 0, count = 0;\npublic:\n    explicit CircularQueue(int capacity) : data(capacity) {}\n    void push(int x) {\n        if (count == (int)data.size()) throw overflow_error(\"full\");\n        data[(front + count) % data.size()] = x; ++count;\n    }\n    int pop() {\n        if (count == 0) throw underflow_error(\"empty\");\n        int x = data[front];\n        front = (front + 1) % data.size(); --count;\n        return x;\n    }\n};"
  },
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
    "code": "int findSlot(const vector<optional<pair<int,int>>>& table, int key) {\n    int n = table.size(), start = (key % n + n) % n;\n    for (int step = 0; step < n; ++step) {\n        int i = (start + step) % n;\n        if (!table[i]) return -1;\n        if (table[i]->first == key) return i;\n    }\n    return -1;\n}"
  },
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
    "code": "struct TreeNode { int value; TreeNode *left, *right; };\n\nvoid inorder(TreeNode* root) {\n    if (!root) return;\n    inorder(root->left);\n    cout << root->value << ' ';\n    inorder(root->right);\n}"
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
    "code": "vector<vector<int>> levelOrder(TreeNode* root) {\n    vector<vector<int>> ans;\n    if (!root) return ans;\n    queue<TreeNode*> q; q.push(root);\n    while (!q.empty()) {\n        int count = q.size(); ans.push_back({});\n        while (count--) {\n            TreeNode* x = q.front(); q.pop();\n            ans.back().push_back(x->value);\n            if (x->left) q.push(x->left);\n            if (x->right) q.push(x->right);\n        }\n    }\n    return ans;\n}"
  },
  {
    "id": "max-heap",
    "chapter": 12,
    "title": "大根堆：上滤与下滤",
    "priority": "必会",
    "purpose": "维护完全二叉树的堆序性质，实现优先级队列。",
    "complexity": "插入、删除最大值 O(log n)；取最大值 O(1)。",
    "invariant": "除当前调整路径外，每个父节点均不小于孩子。",
    "pitfalls": [
      "0 下标孩子为 2i+1、2i+2",
      "下滤选择更大的孩子"
    ],
    "code": "void pushHeap(vector<int>& h, int x) {\n    h.push_back(x);\n    int i = h.size() - 1;\n    while (i > 0) {\n        int p = (i - 1) / 2;\n        if (h[p] >= h[i]) break;\n        swap(h[p], h[i]); i = p;\n    }\n}\n\nint popHeap(vector<int>& h) {\n    int top = h[0]; h[0] = h.back(); h.pop_back();\n    for (int i = 0; ; ) {\n        int l = 2*i+1, r = l+1, best = i;\n        if (l < (int)h.size() && h[l] > h[best]) best = l;\n        if (r < (int)h.size() && h[r] > h[best]) best = r;\n        if (best == i) break;\n        swap(h[i], h[best]); i = best;\n    }\n    return top;\n}"
  },
  {
    "id": "winner-tree",
    "chapter": 13,
    "title": "赢者树：沿路径重赛",
    "priority": "重点理解",
    "purpose": "某个选手变化后，仅沿叶到根路径重新比赛。",
    "complexity": "建树 O(n)，一次重赛 O(log n)。",
    "invariant": "每个内部节点保存其子树的胜者下标。",
    "pitfalls": [
      "树中存选手下标而不是值",
      "先明确较小还是较大者获胜"
    ],
    "code": "int winner(int a, int b, const vector<int>& player) {\n    return player[a] <= player[b] ? a : b;\n}\n\nvoid replay(vector<int>& tree, const vector<int>& player, int leaf) {\n    int node = leaf / 2;\n    while (node > 0) {\n        tree[node] = winner(tree[node * 2], tree[node * 2 + 1], player);\n        node /= 2;\n    }\n}"
  },
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
    "code": "TreeNode* insertBST(TreeNode* root, int value) {\n    if (!root) return new TreeNode{value, nullptr, nullptr};\n    if (value < root->value) root->left = insertBST(root->left, value);\n    else if (value > root->value) root->right = insertBST(root->right, value);\n    return root;\n}\n\nTreeNode* searchBST(TreeNode* root, int value) {\n    while (root && root->value != value)\n        root = value < root->value ? root->left : root->right;\n    return root;\n}"
  },
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
    "code": "int height(Node* x) { return x ? x->height : 0; }\n\nNode* rotateRight(Node* y) {\n    Node* x = y->left;\n    Node* middle = x->right;\n    x->right = y;\n    y->left = middle;\n    y->height = 1 + max(height(y->left), height(y->right));\n    x->height = 1 + max(height(x->left), height(x->right));\n    return x;\n}"
  },
  {
    "id": "graph-traversal",
    "chapter": 16,
    "title": "图的 BFS 与 DFS",
    "priority": "必会",
    "purpose": "遍历图、求连通分量并为最短路和拓扑排序打基础。",
    "complexity": "邻接表下 O(V+E)，空间 O(V)。",
    "invariant": "visited 保证每个顶点最多进入处理流程一次。",
    "pitfalls": [
      "非连通图要多次启动",
      "BFS 入队时立即标记"
    ],
    "code": "void bfs(const vector<vector<int>>& g, int start) {\n    vector<bool> seen(g.size(), false);\n    queue<int> q; q.push(start); seen[start] = true;\n    while (!q.empty()) {\n        int u = q.front(); q.pop();\n        for (int v : g[u]) if (!seen[v]) {\n            seen[v] = true; q.push(v);\n        }\n    }\n}\n\nvoid dfs(const vector<vector<int>>& g, int u, vector<bool>& seen) {\n    seen[u] = true;\n    for (int v : g[u]) if (!seen[v]) dfs(g, v, seen);\n}"
  },
  {
    "id": "topological-sort",
    "chapter": 17,
    "title": "拓扑排序：Kahn 算法",
    "priority": "必会",
    "purpose": "不断删除入度为 0 的顶点，生成依赖顺序。",
    "complexity": "时间 O(V+E)，空间 O(V)。",
    "invariant": "队列只含当前剩余图中入度为 0 的顶点。",
    "pitfalls": [
      "结果不足 V 个说明有环",
      "每删除一条边都更新入度"
    ],
    "code": "vector<int> topoSort(const vector<vector<int>>& g) {\n    vector<int> indegree(g.size(), 0), order;\n    for (auto& edges : g) for (int v : edges) ++indegree[v];\n    queue<int> q;\n    for (int i = 0; i < (int)g.size(); ++i) if (indegree[i] == 0) q.push(i);\n    while (!q.empty()) {\n        int u = q.front(); q.pop(); order.push_back(u);\n        for (int v : g[u]) if (--indegree[v] == 0) q.push(v);\n    }\n    if (order.size() != g.size()) return {};\n    return order;\n}"
  },
  {
    "id": "dijkstra",
    "chapter": 17,
    "title": "Dijkstra 单源最短路径",
    "priority": "必会",
    "purpose": "反复确定当前最近顶点并松弛出边。",
    "complexity": "邻接表加优先队列 O((V+E) log V)。",
    "invariant": "弹出且距离未过期的顶点，其最短距离已确定。",
    "pitfalls": [
      "不能处理负权边",
      "跳过优先队列中的旧距离",
      "注意无穷大与溢出"
    ],
    "code": "vector<long long> dijkstra(const vector<vector<pair<int,int>>>& g, int s) {\n    const long long INF = 4e18;\n    vector<long long> dist(g.size(), INF); dist[s] = 0;\n    using State = pair<long long,int>;\n    priority_queue<State, vector<State>, greater<State>> pq; pq.push({0, s});\n    while (!pq.empty()) {\n        auto [d, u] = pq.top(); pq.pop();\n        if (d != dist[u]) continue;\n        for (auto [v, w] : g[u]) if (d + w < dist[v]) {\n            dist[v] = d + w; pq.push({dist[v], v});\n        }\n    }\n    return dist;\n}"
  },
  {
    "id": "kruskal",
    "chapter": 17,
    "title": "Kruskal 最小生成树",
    "priority": "必会",
    "purpose": "按边权从小到大选择不成环的边。",
    "complexity": "时间 O(E log E)。",
    "invariant": "已选边始终是一片可扩展为最小生成树的森林。",
    "pitfalls": [
      "无向边不要重复",
      "unite 为 false 表示成环",
      "不连通图没有生成树"
    ],
    "code": "struct Edge { int u, v, w; };\n\nlong long kruskal(int n, vector<Edge> edges) {\n    sort(edges.begin(), edges.end(), [](auto& a, auto& b){ return a.w < b.w; });\n    DSU dsu(n); long long cost = 0; int used = 0;\n    for (auto& e : edges) if (dsu.unite(e.u, e.v)) {\n        cost += e.w;\n        if (++used == n - 1) break;\n    }\n    if (used != n - 1) throw runtime_error(\"disconnected\");\n    return cost;\n}"
  },
  {
    "id": "merge-sort",
    "chapter": 18,
    "title": "归并排序",
    "priority": "必会",
    "purpose": "分成两半分别排序，再线性合并两个有序段。",
    "complexity": "时间 O(n log n)，辅助空间 O(n)，稳定。",
    "invariant": "tmp 始终是两个有序前缀的有序合并。",
    "pitfalls": [
      "出口是区间长度不超过 1",
      "相等时先取左边保持稳定"
    ],
    "code": "void mergeSort(vector<int>& a, int left, int right, vector<int>& tmp) {\n    if (right - left <= 1) return;\n    int mid = left + (right - left) / 2;\n    mergeSort(a, left, mid, tmp); mergeSort(a, mid, right, tmp);\n    int i = left, j = mid, k = left;\n    while (i < mid && j < right) tmp[k++] = a[i] <= a[j] ? a[i++] : a[j++];\n    while (i < mid) tmp[k++] = a[i++];\n    while (j < right) tmp[k++] = a[j++];\n    copy(tmp.begin() + left, tmp.begin() + right, a.begin() + left);\n}"
  },
  {
    "id": "quick-sort",
    "chapter": 18,
    "title": "快速排序：分区",
    "priority": "必会",
    "purpose": "围绕基准划分两侧，再递归处理子区间。",
    "complexity": "平均 O(n log n)，最坏 O(n²)。",
    "invariant": "扫描中 [left,i) 不大于基准，[i,j) 大于基准。",
    "pitfalls": [
      "边界约定保持一致",
      "随机基准降低退化概率",
      "普通快排不稳定"
    ],
    "code": "int partition(vector<int>& a, int left, int right) {\n    int pivot = a[right], i = left;\n    for (int j = left; j < right; ++j)\n        if (a[j] <= pivot) swap(a[i++], a[j]);\n    swap(a[i], a[right]);\n    return i;\n}\n\nvoid quickSort(vector<int>& a, int left, int right) {\n    if (left >= right) return;\n    int p = partition(a, left, right);\n    quickSort(a, left, p - 1);\n    quickSort(a, p + 1, right);\n}"
  },
  {
    "id": "knapsack-dp",
    "chapter": 19,
    "title": "0/1 背包：一维动态规划",
    "priority": "必会",
    "purpose": "用状态复用避免枚举所有子集。",
    "complexity": "时间 O(nC)，空间 O(C)。",
    "invariant": "处理完前 i 件后，dp[c] 是容量 c 下的最大价值。",
    "pitfalls": [
      "容量必须从大到小",
      "从小到大将变成完全背包",
      "先写清状态含义"
    ],
    "code": "int knapsack01(const vector<int>& weight, const vector<int>& value, int capacity) {\n    vector<int> dp(capacity + 1, 0);\n    for (int i = 0; i < (int)weight.size(); ++i)\n        for (int c = capacity; c >= weight[i]; --c)\n            dp[c] = max(dp[c], dp[c - weight[i]] + value[i]);\n    return dp[capacity];\n}"
  },
  {
    "id": "floyd",
    "chapter": 19,
    "title": "Floyd 所有顶点对最短路径",
    "priority": "必会",
    "purpose": "逐步允许更多中间顶点，求任意两点最短距离。",
    "complexity": "时间 O(V³)，空间 O(V²)。",
    "invariant": "第 k 轮后，路径只使用编号不超过 k 的中间顶点。",
    "pitfalls": [
      "k 必须放在最外层",
      "两段距离有限时才相加",
      "负权环会破坏结果"
    ],
    "code": "void floyd(vector<vector<long long>>& dist) {\n    int n = dist.size();\n    for (int k = 0; k < n; ++k)\n        for (int i = 0; i < n; ++i)\n            for (int j = 0; j < n; ++j)\n                if (dist[i][k] != INF && dist[k][j] != INF)\n                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);\n}"
  },
  {
    "id": "backtracking-knapsack",
    "chapter": 20,
    "title": "0/1 背包：回溯骨架",
    "priority": "重点理解",
    "purpose": "按选或不选构造搜索树，并用可行性与上界剪枝。",
    "complexity": "最坏 O(2^n)，实际取决于剪枝质量。",
    "invariant": "进入第 i 层时，当前重量和价值准确代表前 i 件选择。",
    "pitfalls": [
      "返回前必须撤销选择",
      "上界必须乐观",
      "先搜更有希望的分支更快"
    ],
    "code": "void dfs(int i, int currentW, int currentV) {\n    if (i == n) { best = max(best, currentV); return; }\n    if (currentW + weight[i] <= capacity) {\n        chosen[i] = true;\n        dfs(i + 1, currentW + weight[i], currentV + value[i]);\n        chosen[i] = false;\n    }\n    if (currentV + optimisticBound(i + 1) > best)\n        dfs(i + 1, currentW, currentV);\n}"
  },
  {
    "id": "branch-bound-loading",
    "chapter": 21,
    "title": "货箱装载：分支定界骨架",
    "priority": "重点理解",
    "purpose": "显式保存活节点，并用上界淘汰不可能更优的分支。",
    "complexity": "最坏 O(2^n)，好界函数可大幅减少扩展。",
    "invariant": "优先队列只保留仍可能超过 best 的活节点。",
    "pitfalls": [
      "结点要包含层数、当前值和上界",
      "优先队列按上界排序",
      "与递归回溯的活节点管理不同"
    ],
    "code": "struct State { int level, weight, bound; };\nauto cmp = [](const State& a, const State& b){ return a.bound < b.bound; };\npriority_queue<State, vector<State>, decltype(cmp)> live(cmp);\nlive.push({0, 0, totalWeight});\n\nwhile (!live.empty()) {\n    State x = live.top(); live.pop();\n    if (x.bound <= best || x.level == n) continue;\n    int i = x.level;\n    if (x.weight + w[i] <= capacity) {\n        best = max(best, x.weight + w[i]);\n        live.push({i + 1, x.weight + w[i], x.bound});\n    }\n    int withoutBound = x.bound - w[i];\n    if (withoutBound > best) live.push({i + 1, x.weight, withoutBound});\n}"
  },
{
  "id": "dynamic-2d-array",
  "chapter": 1,
  "title": "动态二维数组：申请与释放",
  "priority": "必会",
  "purpose": "复习二级指针、异常安全和成对释放资源。",
  "complexity": "申请与释放均为 O(rows)。",
  "invariant": "成功返回时每一行都已分配；失败时已分配行全部释放。",
  "pitfalls": [
    "逐行释放后再释放行指针数组",
    "部分分配失败要回滚",
    "工程中优先使用 vector"
  ],
  "code": "template<class T>\nT** make2D(int rows, int cols) {\n    T** a = new T*[rows]{};\n    try {\n        for (int i = 0; i < rows; ++i) a[i] = new T[cols]{};\n    } catch (...) {\n        for (int i = 0; i < rows; ++i) delete[] a[i];\n        delete[] a;\n        throw;\n    }\n    return a;\n}\n\ntemplate<class T>\nvoid free2D(T** a, int rows) {\n    for (int i = 0; i < rows; ++i) delete[] a[i];\n    delete[] a;\n}"
},
{
  "id": "permutations",
  "chapter": 1,
  "title": "递归生成全排列",
  "priority": "重点理解",
  "purpose": "用交换和回溯展示递归选择、进入下一层和撤销选择。",
  "complexity": "时间 O(n·n!)，递归栈 O(n)。",
  "invariant": "进入第 k 层时，[0,k) 已固定，[k,n) 等待排列。",
  "pitfalls": [
    "递归返回后必须交换回来",
    "有重复元素时需要去重"
  ],
  "code": "void permutations(vector<int>& a, int k) {\n    if (k == (int)a.size()) {\n        print(a);\n        return;\n    }\n    for (int i = k; i < (int)a.size(); ++i) {\n        swap(a[k], a[i]);\n        permutations(a, k + 1);\n        swap(a[k], a[i]);\n    }\n}"
},
{
  "id": "bubble-sort",
  "chapter": 2,
  "title": "改进冒泡排序：提前结束",
  "priority": "必会",
  "purpose": "理解一次扫描如何把最大元素送到末尾，并利用交换标志识别已有序。",
  "complexity": "最好 O(n)，最坏 O(n²)，原地且稳定。",
  "invariant": "第 i 轮结束后，末尾 i 个元素已在最终位置。",
  "pitfalls": [
    "内层只比较到 n-1-i",
    "整轮无交换即可结束"
  ],
  "code": "void bubbleSort(vector<int>& a) {\n    for (int end = (int)a.size() - 1; end > 0; --end) {\n        bool changed = false;\n        for (int i = 0; i < end; ++i) {\n            if (a[i] > a[i + 1]) {\n                swap(a[i], a[i + 1]);\n                changed = true;\n            }\n        }\n        if (!changed) break;\n    }\n}"
},
{
  "id": "horner",
  "chapter": 3,
  "title": "霍纳法：把多项式降为线性复杂度",
  "priority": "必会",
  "purpose": "用同一个计算任务对比 O(n²) 与 Θ(n) 的算法设计。",
  "complexity": "时间 Θ(n)，额外空间 O(1)。",
  "invariant": "处理到系数 i 时，result 表示已处理前缀对应的嵌套多项式值。",
  "pitfalls": [
    "系数顺序必须明确",
    "不要重复计算 x 的幂"
  ],
  "code": "double horner(const vector<double>& coefficient, double x) {\n    double result = 0;\n    for (double c : coefficient) result = result * x + c;\n    return result;\n}"
},
{
  "id": "growth-check",
  "chapter": 3,
  "title": "经验增长率：倍增规模估算阶数",
  "priority": "重点理解",
  "purpose": "用 T(2n)/T(n) 的变化辅助判断线性、平方或对数增长。",
  "complexity": "取决于被测算法；记录本身 O(k)。",
  "invariant": "每次只改变输入规模，数据分布和运行环境保持一致。",
  "pitfalls": [
    "经验测量不能代替数学证明",
    "输入过小会受固定开销影响"
  ],
  "code": "for (int n = 1024; n <= 1 << 20; n *= 2) {\n    auto data = makeInput(n, fixedSeed);\n    double time = benchmark(algorithm, data, repetitions);\n    cout << n << ' ' << time << '\\n';\n}"
},
{
  "id": "cache-loop-order",
  "chapter": 4,
  "title": "矩阵遍历：循环次序与高速缓存",
  "priority": "必会",
  "purpose": "通过连续访问行元素减少缓存未命中，理解实验结果为何受存储布局影响。",
  "complexity": "两种写法均为 Θ(rows·cols)，常数差异显著。",
  "invariant": "行优先存储下，内层循环沿连续地址前进。",
  "pitfalls": [
    "复杂度相同不等于运行时间相同",
    "测试前应预热并重复运行"
  ],
  "code": "long long rowMajorSum(const vector<vector<int>>& a) {\n    long long sum = 0;\n    for (int i = 0; i < (int)a.size(); ++i)\n        for (int j = 0; j < (int)a[i].size(); ++j)\n            sum += a[i][j];\n    return sum;\n}"
},
{
  "id": "benchmark-statistics",
  "chapter": 4,
  "title": "性能实验：中位数计时",
  "priority": "重点理解",
  "purpose": "多次采样并取中位数，降低系统调度和偶发抖动的影响。",
  "complexity": "r 次实验外加 O(r log r) 的样本排序。",
  "invariant": "所有样本使用相同规模与相同实验步骤。",
  "pitfalls": [
    "不要只报告最快一次",
    "计时前后避免输出",
    "记录编译器优化级别"
  ],
    "code": "const int runs = 9;\nvector<double> samples;\nfor (int r = 0; r < runs; ++r)\n    samples.push_back(runOnce());\nsort(samples.begin(), samples.end());\ndouble median = samples[samples.size() / 2];"
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
  "code": "template<class T>\nclass ArrayIterator {\n    T* position;\npublic:\n    explicit ArrayIterator(T* p = nullptr) : position(p) {}\n    T& operator*() const { return *position; }\n    ArrayIterator& operator++() { ++position; return *this; }\n    bool operator!=(const ArrayIterator& other) const {\n        return position != other.position;\n    }\n};"
},
{
  "id": "reverse-list",
  "chapter": 6,
  "title": "单向链表原地反转",
  "priority": "必会",
  "purpose": "训练保存后继、反转指针和推进三个动作的严格顺序。",
  "complexity": "时间 O(n)，额外空间 O(1)。",
  "invariant": "prev 指向已反转前缀，current 指向尚未处理后缀首节点。",
  "pitfalls": [
    "改 next 前先保存后继",
    "结束后 head 应更新为 prev"
  ],
  "code": "Node* reverseList(Node* head) {\n    Node* prev = nullptr;\n    Node* current = head;\n    while (current) {\n        Node* next = current->next;\n        current->next = prev;\n        prev = current;\n        current = next;\n    }\n    return prev;\n}"
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
  "code": "int offset2D(int row, int col, int rows, int cols) {\n    if (row < 0 || row >= rows || col < 0 || col >= cols)\n        throw out_of_range(\"matrix index\");\n    return row * cols + col;\n}"
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
  "code": "int getTri(const vector<int>& lower, const vector<int>& diag,\n           const vector<int>& upper, int row, int col) {\n    if (row == col) return diag[row];\n    if (row == col + 1) return lower[col];\n    if (col == row + 1) return upper[row];\n    return 0;\n}"
},
{
  "id": "array-stack",
  "chapter": 8,
  "title": "数组栈：push 与 pop",
  "priority": "必会",
  "purpose": "掌握栈顶下标、扩容和空栈异常。",
  "complexity": "push 均摊 O(1)，pop O(1)。",
  "invariant": "data.back() 始终是栈顶。",
  "pitfalls": [
    "pop 前先判空",
    "弹出时若要返回元素，先保存再删除"
  ],
  "code": "class ArrayStack {\n    vector<int> data;\npublic:\n    bool empty() const { return data.empty(); }\n    void push(int x) { data.push_back(x); }\n    int pop() {\n        if (data.empty()) throw underflow_error(\"empty stack\");\n        int x = data.back();\n        data.pop_back();\n        return x;\n    }\n};"
},
{
  "id": "postfix-evaluation",
  "chapter": 8,
  "title": "栈应用：后缀表达式求值",
  "priority": "必会",
  "purpose": "遇到操作数入栈，遇到运算符弹出两个操作数计算并压回。",
  "complexity": "时间 O(n)，空间 O(n)。",
  "invariant": "栈保存已扫描前缀中尚未参与更高层运算的中间结果。",
  "pitfalls": [
    "先弹出的是右操作数",
    "结束时栈中必须恰好一个结果"
  ],
  "code": "int evaluatePostfix(const vector<string>& token) {\n    stack<int> st;\n    for (auto& s : token) {\n        if (isdigit(s[0]) || s.size() > 1) st.push(stoi(s));\n        else {\n            int right = st.top(); st.pop();\n            int left = st.top(); st.pop();\n            st.push(s == \"+\" ? left + right : left * right);\n        }\n    }\n    return st.top();\n}"
},
{
  "id": "linked-queue",
  "chapter": 9,
  "title": "链式队列：双指针实现",
  "priority": "必会",
  "purpose": "用 head/tail 保证两端操作都是常数时间。",
  "complexity": "入队和出队均为 O(1)。",
  "invariant": "空队列时 head 和 tail 同时为空；非空时 tail->next 为空。",
  "pitfalls": [
    "删除最后一个节点后 tail 也要置空",
    "不要每次入队都从头遍历"
  ],
  "code": "class LinkedQueue {\n    Node *head = nullptr, *tail = nullptr;\npublic:\n    void push(int value) {\n        Node* node = new Node{value, nullptr};\n        if (tail) tail->next = node; else head = node;\n        tail = node;\n    }\n    int pop() {\n        if (!head) throw underflow_error(\"empty queue\");\n        Node* node = head; int value = node->value;\n        head = head->next;\n        if (!head) tail = nullptr;\n        delete node;\n        return value;\n    }\n};"
},
{
  "id": "queue-train",
  "chapter": 9,
  "title": "队列应用：按轨道缓冲重排",
  "priority": "重点理解",
  "purpose": "展示多条 FIFO 缓冲轨道如何支持按目标顺序输出。",
  "complexity": "取决于轨道选择策略，基本扫描 O(nk)。",
  "invariant": "每条轨道内部保持入队顺序，轨道尾元素必须允许当前车厢放入。",
  "pitfalls": [
    "队列只能从头部输出",
    "轨道选择要避免阻塞后续更小编号"
  ],
  "code": "int bestTrack(const vector<queue<int>>& track, int car) {\n    int best = -1, bestBack = -1;\n    for (int i = 0; i < (int)track.size(); ++i) {\n        if (track[i].empty()) {\n            if (best == -1) best = i;\n        } else if (track[i].back() < car && track[i].back() > bestBack) {\n            best = i;\n            bestBack = track[i].back();\n        }\n    }\n    return best;\n}"
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
  "code": "class ChainedHash {\n    vector<list<pair<int,int>>> bucket;\npublic:\n    explicit ChainedHash(int n) : bucket(n) {}\n    void put(int key, int value) {\n        auto& chain = bucket[(key % bucket.size() + bucket.size()) % bucket.size()];\n        for (auto& [k, v] : chain) if (k == key) { v = value; return; }\n        chain.push_front({key, value});\n    }\n};"
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
  "code": "SkipNode* search(SkipNode* head, int key) {\n    SkipNode* current = head;\n    for (int level = maxLevel; level >= 0; --level) {\n        while (current->next[level] &&\n               current->next[level]->key < key)\n            current = current->next[level];\n    }\n    current = current->next[0];\n    return current && current->key == key ? current : nullptr;\n}"
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
      "code": "int treeHeight(TreeNode* root) {\n    if (!root) return 0;\n    return 1 + max(treeHeight(root->left), treeHeight(root->right));\n}\n\nint nodeCount(TreeNode* root) {\n    if (!root) return 0;\n    return 1 + nodeCount(root->left) + nodeCount(root->right);\n}"
    },
  {
    "id": "heapify-sort",
  "chapter": 12,
  "title": "自底向上建堆与堆排序",
  "priority": "必会",
  "purpose": "先在线性时间建大根堆，再反复把最大值放到数组末尾。",
  "complexity": "建堆 O(n)，排序 O(n log n)，原地且不稳定。",
  "invariant": "排序阶段中 [end,n) 已有序，[0,end) 保持大根堆。",
  "pitfalls": [
    "最后一个非叶节点是 n/2-1",
    "交换堆顶后堆大小要缩一"
  ],
  "code": "void heapSort(vector<int>& a) {\n    for (int i = (int)a.size() / 2 - 1; i >= 0; --i)\n        siftDown(a, i, a.size());\n    for (int end = (int)a.size() - 1; end > 0; --end) {\n        swap(a[0], a[end]);\n        siftDown(a, 0, end);\n    }\n}"
},
{
  "id": "huffman",
  "chapter": 12,
  "title": "霍夫曼树构造",
  "priority": "重点理解",
  "purpose": "反复合并权重最小的两棵树，得到最优前缀编码树。",
  "complexity": "优先队列实现 O(n log n)。",
  "invariant": "队列保存尚未合并的子树，键是子树总权重。",
  "pitfalls": [
    "每次必须取两个最小权重",
    "左右边 0/1 约定不影响码长",
    "单字符输入需特殊处理"
  ],
  "code": "HuffmanNode* buildHuffman(const vector<int>& frequency) {\n    priority_queue<HuffmanNode*, vector<HuffmanNode*>, ByWeight> pq;\n    for (int i = 0; i < (int)frequency.size(); ++i)\n        if (frequency[i] > 0) pq.push(new HuffmanNode{frequency[i], i});\n    while (pq.size() > 1) {\n        auto left = pq.top(); pq.pop();\n        auto right = pq.top(); pq.pop();\n        pq.push(new HuffmanNode{left->weight + right->weight, -1, left, right});\n    }\n    return pq.top();\n}"
},
{
  "id": "loser-tree",
  "chapter": 13,
  "title": "输者树：调整路径",
  "priority": "重点理解",
  "purpose": "内部节点记录比赛失败者，根附近直接保留总冠军，适合多路归并。",
  "complexity": "一次调整 O(log k)。",
  "invariant": "从选手到根的路径保存它与各层对手比较后的失败者。",
  "pitfalls": [
    "胜负规则要统一",
    "叶子耗尽时使用无穷大哨兵"
  ],
  "code": "void adjust(int playerIndex) {\n    int winner = playerIndex;\n    for (int parent = (playerIndex + k) / 2; parent > 0; parent /= 2) {\n        if (lessPlayer(tree[parent], winner))\n            swap(tree[parent], winner);\n    }\n    tree[0] = winner;\n}"
},
{
  "id": "k-way-merge",
  "chapter": 13,
  "title": "竞赛树应用：多路归并",
  "priority": "必会",
  "purpose": "每次输出当前各路首元素中的最小值，再只更新对应一路。",
  "complexity": "输出 N 个元素需要 O(N log k)。",
  "invariant": "竞赛树冠军始终是所有未耗尽输入流的当前最小首元素。",
  "pitfalls": [
    "一路耗尽后用无穷大替代",
    "输出后只重赛发生变化的叶子"
  ],
  "code": "while (winnerValue() != INF) {\n    int stream = winnerIndex();\n    output.push_back(current[stream]);\n    if (readNext(stream, current[stream])) replay(stream);\n    else { current[stream] = INF; replay(stream); }\n}"
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
  "code": "TreeNode* eraseBST(TreeNode* root, int key) {\n    if (!root) return nullptr;\n    if (key < root->value) root->left = eraseBST(root->left, key);\n    else if (key > root->value) root->right = eraseBST(root->right, key);\n    else {\n        if (!root->left) { auto r = root->right; delete root; return r; }\n        if (!root->right) { auto l = root->left; delete root; return l; }\n        TreeNode* next = root->right;\n        while (next->left) next = next->left;\n        root->value = next->value;\n        root->right = eraseBST(root->right, next->value);\n    }\n    return root;\n}"
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
  "code": "TreeNode* selectByRank(TreeNode* root, int k) {\n    while (root) {\n        int leftSize = root->left ? root->left->size : 0;\n        if (k == leftSize) return root;\n        if (k < leftSize) root = root->left;\n        else { k -= leftSize + 1; root = root->right; }\n    }\n    return nullptr;\n}"
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
  "code": "Node* rebalance(Node* root) {\n    updateHeight(root);\n    int balance = height(root->left) - height(root->right);\n    if (balance > 1) {\n        if (height(root->left->left) < height(root->left->right))\n            root->left = rotateLeft(root->left);\n        return rotateRight(root);\n    }\n    if (balance < -1) {\n        if (height(root->right->right) < height(root->right->left))\n            root->right = rotateRight(root->right);\n        return rotateLeft(root);\n    }\n    return root;\n}"
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
  "code": "while (node != root && color(node->parent) == RED) {\n    Node* parent = node->parent;\n    Node* grand = parent->parent;\n    Node* uncle = grand->right;\n    if (color(uncle) == RED) {\n        setBlack(parent); setBlack(uncle); setRed(grand);\n        node = grand;\n    } else {\n        if (node == parent->right) { node = parent; rotateLeft(node); }\n        setBlack(node->parent); setRed(grand);\n        rotateRight(grand);\n    }\n}\nsetBlack(root);"
},
{
  "id": "adjacency-list",
  "chapter": 16,
  "title": "邻接表建图",
  "priority": "必会",
  "purpose": "以 O(V+E) 空间保存稀疏图，为遍历和最短路提供统一结构。",
  "complexity": "添加一条边 O(1)，空间 O(V+E)。",
  "invariant": "g[u] 只保存从 u 出发的边。",
  "pitfalls": [
    "无向图必须双向添加",
    "加权图保存终点与权重",
    "顶点编号先做范围检查"
  ],
  "code": "using Graph = vector<vector<pair<int,int>>>;\n\nvoid addDirectedEdge(Graph& g, int from, int to, int weight) {\n    g[from].push_back({to, weight});\n}\n\nvoid addUndirectedEdge(Graph& g, int a, int b, int weight) {\n    addDirectedEdge(g, a, b, weight);\n    addDirectedEdge(g, b, a, weight);\n}"
},
{
  "id": "connected-components",
  "chapter": 16,
  "title": "无向图连通分量标记",
  "priority": "必会",
  "purpose": "从每个未访问顶点启动 DFS，为同一连通分量赋相同编号。",
  "complexity": "时间 O(V+E)，空间 O(V)。",
  "invariant": "完成一次 DFS 后，与起点连通的所有顶点都获得当前分量编号。",
  "pitfalls": [
    "外层必须扫描所有顶点",
    "有向图应改用强连通分量算法"
  ],
  "code": "int markComponents(const vector<vector<int>>& g, vector<int>& component) {\n    int count = 0;\n    component.assign(g.size(), -1);\n    for (int u = 0; u < (int)g.size(); ++u) {\n        if (component[u] != -1) continue;\n        dfsMark(g, u, count, component);\n        ++count;\n    }\n    return count;\n}"
},
{
  "id": "quickselect",
  "chapter": 18,
  "title": "快速选择：第 k 小元素",
  "priority": "必会",
  "purpose": "只递归进入包含目标排名的一侧，避免完整排序。",
  "complexity": "期望 O(n)，最坏 O(n²)。",
  "invariant": "每次分区后，基准已经位于最终排名位置。",
  "pitfalls": [
    "k 是下标还是第几个要统一",
    "随机选择基准降低退化风险"
  ],
  "code": "int quickSelect(vector<int>& a, int left, int right, int k) {\n    while (left <= right) {\n        int p = partition(a, left, right);\n        if (p == k) return a[p];\n        if (k < p) right = p - 1;\n        else left = p + 1;\n    }\n    throw out_of_range(\"rank\");\n}"
},
{
  "id": "bellman-ford",
  "chapter": 19,
  "title": "Bellman-Ford：含负权最短路径",
  "priority": "必会",
  "purpose": "反复松弛所有边，并检测从源点可达的负权环。",
  "complexity": "时间 O(VE)，空间 O(V)。",
  "invariant": "第 i 轮后，dist 至少覆盖使用不超过 i 条边的最短路径。",
  "pitfalls": [
    "无穷大距离不能参与加法",
    "第 V 轮仍可松弛说明存在可达负环"
  ],
  "code": "bool bellmanFord(int n, const vector<Edge>& edges, int source,\n                 vector<long long>& dist) {\n    dist.assign(n, INF); dist[source] = 0;\n    for (int i = 1; i < n; ++i) {\n        bool changed = false;\n        for (auto& e : edges)\n            if (dist[e.u] != INF && dist[e.u] + e.w < dist[e.v]) {\n                dist[e.v] = dist[e.u] + e.w; changed = true;\n            }\n        if (!changed) break;\n    }\n    for (auto& e : edges)\n        if (dist[e.u] != INF && dist[e.u] + e.w < dist[e.v]) return false;\n    return true;\n}"
},
{
  "id": "maximum-clique-backtrack",
  "chapter": 20,
  "title": "最大完备子图：回溯骨架",
  "priority": "重点理解",
  "purpose": "按顶点选或不选搜索，并在候选规模无法超过最优值时剪枝。",
  "complexity": "最坏 O(2^V)。",
  "invariant": "selected 中任意两个已选顶点之间都有边。",
  "pitfalls": [
    "加入顶点前检查与所有已选顶点相邻",
    "剩余顶点上界不足时立即返回"
  ],
  "code": "void cliqueDfs(int vertex) {\n    if (currentSize + (n - vertex) <= bestSize) return;\n    if (vertex == n) { bestSize = max(bestSize, currentSize); return; }\n\n    bool compatible = true;\n    for (int u = 0; u < vertex; ++u)\n        if (selected[u] && !adjacent[u][vertex]) compatible = false;\n    if (compatible) {\n        selected[vertex] = true; ++currentSize;\n        cliqueDfs(vertex + 1);\n        --currentSize; selected[vertex] = false;\n    }\n    cliqueDfs(vertex + 1);\n}"
},
{
  "id": "tsp-backtrack",
  "chapter": 20,
  "title": "旅行商问题：回溯与剪枝",
  "priority": "重点理解",
  "purpose": "逐个选择下一座城市，路径成本已不优于当前最优时停止。",
  "complexity": "最坏 O(n!)。",
  "invariant": "path[0..depth) 不重复，cost 是当前部分路径的准确代价。",
  "pitfalls": [
    "终点必须加上回到起点的边",
    "递归返回后恢复 visited",
    "无边时不能继续"
  ],
  "code": "void tspDfs(int depth, int last, long long cost) {\n    if (cost >= best) return;\n    if (depth == n) {\n        if (weight[last][start] < INF)\n            best = min(best, cost + weight[last][start]);\n        return;\n    }\n    for (int next = 0; next < n; ++next) {\n        if (!visited[next] && weight[last][next] < INF) {\n            visited[next] = true;\n            tspDfs(depth + 1, next, cost + weight[last][next]);\n            visited[next] = false;\n        }\n    }\n}"
},
{
  "id": "best-first-knapsack",
  "chapter": 21,
  "title": "0/1 背包：最佳优先分支定界",
  "priority": "重点理解",
  "purpose": "按价值上界扩展最有希望的活节点，尽早找到高质量可行解。",
  "complexity": "最坏 O(2^n)，通常依赖界函数显著剪枝。",
  "invariant": "堆顶具有当前所有活节点中最大的乐观价值上界。",
  "pitfalls": [
    "分数背包只能用于计算上界",
    "上界不超过 best 的节点直接舍弃",
    "结点需记录层数、重量和价值"
  ],
  "code": "struct BoundNode { int level, weight, value; double bound; };\npriority_queue<BoundNode, vector<BoundNode>, ByBound> live;\nlive.push(rootNode());\n\nwhile (!live.empty()) {\n    auto node = live.top(); live.pop();\n    if (node.bound <= bestValue || node.level == n) continue;\n    for (auto child : expandTakeOrSkip(node)) {\n        if (child.weight <= capacity) bestValue = max(bestValue, child.value);\n        child.bound = fractionalUpperBound(child);\n        if (child.bound > bestValue) live.push(child);\n    }\n}"
},
{
  "id": "tsp-branch-bound",
  "chapter": 21,
  "title": "旅行商问题：最小堆分支定界",
  "priority": "重点理解",
  "purpose": "用部分回路的代价下界决定下一步扩展哪个排列节点。",
  "complexity": "最坏 O(n!)，下界越紧扩展越少。",
  "invariant": "最小堆按乐观总成本下界排序，完整回路提供当前上界。",
  "pitfalls": [
    "下界必须不大于该节点任何完整解成本",
    "出堆下界不小于 best 时可终止",
    "避免重复城市"
  ],
  "code": "priority_queue<TspNode, vector<TspNode>, ByLowerBound> live;\nlive.push(makeRoot());\n\nwhile (!live.empty()) {\n    TspNode node = live.top(); live.pop();\n    if (node.lowerBound >= bestCost) continue;\n    if (node.path.size() == n) {\n        bestCost = min(bestCost, closeTour(node));\n        continue;\n    }\n    for (int city : unvisitedCities(node)) {\n        TspNode child = appendCity(node, city);\n        child.lowerBound = computeLowerBound(child);\n        if (child.lowerBound < bestCost) live.push(child);\n    }\n}"
}
] as CodeReviewItem[];

export const CODE_LIBRARY_CHAPTERS = Array.from(
  new Set(DATA_STRUCTURE_CODE_LIBRARY.map((item) => item.chapter)),
).sort((a, b) => a - b);
