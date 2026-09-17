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
  }
] as CodeReviewItem[];

export const CODE_LIBRARY_CHAPTERS = Array.from(
  new Set(DATA_STRUCTURE_CODE_LIBRARY.map((item) => item.chapter)),
).sort((a, b) => a - b);
