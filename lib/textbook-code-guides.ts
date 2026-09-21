import type { TextbookCodeItem } from "./textbook-code-library.ts";

export type TextbookCodeGuide = {
  textbookScope: string;
  prerequisites: readonly string[];
  steps: readonly string[];
  complexity: string;
  invariant: string;
  pitfalls: readonly string[];
};

type GuideCore = Omit<TextbookCodeGuide, "textbookScope">;

const chapterNames = [
  "", "C++ 回顾", "程序性能分析", "渐近记法", "性能测量", "线性表—数组描述",
  "线性表—链式描述", "数组和矩阵", "栈", "队列", "跳表和散列",
  "二叉树和其他树", "优先级队列", "竞赛树", "搜索树", "平衡搜索树",
  "图", "贪婪算法", "分而治之", "动态规划", "回溯法", "分支定界",
] as const;

const chapterDefaults: Record<number, GuideCore> = {
  1: {
    prerequisites: ["C++ 函数、参数与返回值", "模板、类和动态内存的基本语法"],
    steps: ["确认函数或类对外提供的接口。", "跟踪参数、局部变量和动态对象的创建。", "按控制流执行核心语句并观察返回值或输出。", "检查异常分支与资源释放位置。"],
    complexity: "本章代码以语言机制演示为主；复杂度通常由循环次数、递归深度或动态数组长度决定。",
    invariant: "每次函数调用都应满足参数约束；对象在公开方法执行前后必须保持有效状态。",
    pitfalls: ["混淆值传递、引用传递和 const 引用。", "动态申请的数组忘记释放，或异常路径破坏资源管理。"],
  },
  2: {
    prerequisites: ["输入规模 n 与基本操作", "循环、递归和数组访问"],
    steps: ["确定输入规模及需要统计的基本操作。", "沿循环或递归路径记录操作次数。", "区分最好、最坏与平均输入。", "把计数结果化为随 n 增长的复杂度。"],
    complexity: "以代码中的操作计数为准，重点比较常数、线性、平方和递归增长。",
    invariant: "计数模型在整个分析中必须固定，同一比较只统计同一种基本操作。",
    pitfalls: ["把一次机器实测时间直接当作算法复杂度。", "忽略嵌套循环边界或递归调用产生的额外工作。"],
  },
  3: {
    prerequisites: ["有序数组", "循环不变量和对数"],
    steps: ["维护当前仍可能包含目标的搜索区间。", "比较中点元素与目标值。", "排除不可能的一半区间。", "区间为空或命中时结束。"],
    complexity: "二分搜索每轮把区间缩小一半，时间 O(log n)，额外空间 O(1)。",
    invariant: "若目标存在，它始终位于当前闭区间内。",
    pitfalls: ["中点或左右边界更新错误导致死循环。", "在未排序的数据上使用二分搜索。"],
  },
  4: {
    prerequisites: ["复杂度分析", "计时器、测试规模和数据分布"],
    steps: ["构造指定规模与分布的测试数据。", "把计时范围限制在目标算法。", "重复执行并记录稳定结果。", "随规模变化比较实测曲线与理论预期。"],
    complexity: "测量代码本身不改变被测算法的渐近复杂度，但初始化、I/O 和计时开销必须排除。",
    invariant: "不同实验只改变计划中的变量，其余环境和输入条件保持一致。",
    pitfalls: ["把数据生成、输出或首次缓存预热计入算法时间。", "只测试一个规模或一种输入分布。"],
  },
  5: {
    prerequisites: ["线性表抽象数据类型", "连续存储、下标和动态数组"],
    steps: ["检查表长、容量和元素数组的初始状态。", "按下标定位目标位置并验证范围。", "插入或删除时移动受影响的连续元素。", "容量不足时扩容并更新长度信息。"],
    complexity: "按下标访问 O(1)；查找、任意位置插入和删除通常 O(n)；扩容单次 O(n)，倍增策略下追加均摊 O(1)。",
    invariant: "始终满足 0 ≤ listSize ≤ arrayLength，且有效元素恰好位于 element[0..listSize-1]。",
    pitfalls: ["混淆表长 listSize 与容量 arrayLength。", "移动区间方向错误造成元素覆盖或越界。"],
  },
  6: {
    prerequisites: ["指针和动态结点", "单链表的前驱、后继关系"],
    steps: ["确定头指针、当前结点和目标位置。", "沿 next 链逐结点定位。", "插入或删除时先保存仍需访问的链接。", "更新链并处理空表、首结点和尾结点边界。"],
    complexity: "按位置访问和查找通常 O(n)；已知前驱结点后的插入、删除为 O(1)。",
    invariant: "从头结点沿 next 能且只能到达表中全部结点，表长与可达结点数一致。",
    pitfalls: ["修改链接前未保存后继，导致后半条链丢失。", "遗漏空表、头结点或尾结点的特殊情况。"],
  },
  7: {
    prerequisites: ["二维数组地址映射", "矩阵下标和特殊矩阵结构"],
    steps: ["确认逻辑行列范围和存储布局。", "把二维下标映射到一维存储位置。", "仅访问结构允许保存的元素。", "矩阵运算后维持行列与非零项信息。"],
    complexity: "普通矩阵运算通常由行列乘积决定；压缩矩阵的空间和遍历成本取决于实际存储元素数。",
    invariant: "每个合法逻辑元素都映射到唯一存储位置，未存储位置的隐含值保持不变。",
    pitfalls: ["把从 0 开始与从 1 开始的下标公式混用。", "矩阵维度不匹配仍执行加法或乘法。"],
  },
  8: {
    prerequisites: ["后进先出 LIFO", "数组或链表的栈顶操作"],
    steps: ["初始化空栈及栈顶位置。", "遇到待处理对象时压栈保存状态。", "需要回退或匹配时读取并弹出栈顶。", "结束时检查栈是否满足问题要求。"],
    complexity: "单次 push、pop、top 为 O(1)；应用总复杂度通常与处理元素个数成线性关系。",
    invariant: "栈中元素按尚未完成任务的进入顺序保存，栈顶始终是下一项要处理的状态。",
    pitfalls: ["空栈上执行 top 或 pop。", "数组栈扩容后忘记更新容量或栈顶位置。"],
  },
  9: {
    prerequisites: ["先进先出 FIFO", "循环数组或链式队列"],
    steps: ["初始化队首、队尾与空队列状态。", "新任务从队尾入队。", "按到达顺序从队首取出并处理。", "循环推进直到队列为空或仿真结束。"],
    complexity: "单次入队和出队为 O(1)；完整应用通常与入队对象和处理事件总数成线性关系。",
    invariant: "队首是最早仍未处理的元素，队列中的相对到达顺序始终不变。",
    pitfalls: ["循环队列中空与满的判定混淆。", "移动队首、队尾时忘记取模或处理最后一个元素。"],
  },
  10: {
    prerequisites: ["字典 ADT 与关键字比较", "随机层级、散列函数和冲突处理"],
    steps: ["把关键字转换为比较值或散列地址。", "沿有序链、跳表层级或散列表探查目标。", "命中时读取或更新记录，未命中时确定插入点。", "删除或扩展后恢复索引结构。"],
    complexity: "跳表和良好散列表的平均查找、插入、删除为 O(log n) 或 O(1)，最坏均可能退化为 O(n)。",
    invariant: "索引路径、散列位置与实际记录保持一致；所有可达记录的关键字关系满足结构约束。",
    pitfalls: ["散列负值、容量和取模处理不一致。", "删除后破坏探查链或跳表跨层链接。"],
  },
  11: {
    prerequisites: ["树、结点、父子关系", "递归与前中后序遍历"],
    steps: ["从根结点建立或接收二叉树。", "按指定遍历次序递归处理左右子树。", "在访问结点时执行输出、计算或合并。", "空子树返回后逐层恢复调用状态。"],
    complexity: "完整遍历访问每个结点一次，时间 O(n)；递归栈空间 O(h)，h 为树高。",
    invariant: "每个已进入的递归调用只负责当前子树，且每个结点按目标次序恰好访问一次。",
    pitfalls: ["混淆前序、中序和后序中访问根的位置。", "未处理空树，或销毁时遗漏子树造成内存泄漏。"],
  },
  12: {
    prerequisites: ["完全二叉树的数组表示", "堆序性质和优先级队列"],
    steps: ["确认堆大小和根结点的极值性质。", "插入时沿父链上浮。", "删除根后用末元素填补并向下调整。", "重复调整直到父子关系恢复。"],
    complexity: "堆的插入和删除为 O(log n)，取最大/最小元素 O(1)，自底向上建堆 O(n)。",
    invariant: "堆始终保持完全二叉树形状，且每个父结点的优先级不低于其孩子。",
    pitfalls: ["数组从 0 或 1 开始时父子下标公式混用。", "下沉时没有选择优先级更高的孩子。"],
  },
  13: {
    prerequisites: ["完全二叉树", "竞赛树的胜者传播"],
    steps: ["把参赛元素放到外部结点。", "自底向上比较并记录每场胜者。", "读取根部得到全局胜者。", "元素变化后只重赛其到根路径。"],
    complexity: "初始化通常 O(n)，一次重赛或取得下一胜者 O(log n)。",
    invariant: "每个内部结点记录其覆盖子树中的胜者，根结点记录全局胜者。",
    pitfalls: ["叶子数不是 2 的幂时映射错误。", "更新元素后遗漏祖先路径上的重赛。"],
  },
  14: {
    prerequisites: ["二叉搜索树有序性质", "树的搜索、插入和删除"],
    steps: ["从根开始比较关键字。", "根据比较结果进入左或右子树。", "命中后执行查询、更新或删除。", "结构改变后重新连接子树并保持有序关系。"],
    complexity: "查找、插入、删除为 O(h)；平均树高约 O(log n)，退化链表时为 O(n)。",
    invariant: "任一结点左子树关键字小于该结点，右子树关键字大于该结点，并递归成立。",
    pitfalls: ["删除有两个孩子的结点时没有正确替换并删除后继。", "重复关键字策略前后不一致。"],
  },
  15: {
    prerequisites: ["二叉搜索树", "旋转与树高"],
    steps: ["沿搜索路径定位更新位置。", "回溯检查平衡或颜色约束。", "通过旋转、重染色或分裂修复。", "确认根与所有子树重新满足约束。"],
    complexity: "平衡搜索树把树高控制在 O(log n)，查找、插入和删除均为 O(log n)。",
    invariant: "搜索树有序性与对应平衡规则在每次更新后同时成立。",
    pitfalls: ["旋转后父子指针或根指针更新不完整。", "只修复局部高度却破坏颜色或层级约束。"],
  },
  16: {
    prerequisites: ["图的顶点、边和邻接关系", "邻接矩阵、邻接表、队列与递归"],
    steps: ["构造顶点与边的存储表示。", "选择起点并初始化访问状态。", "按 BFS、DFS 或路径算法扩展邻接顶点。", "记录前驱、连通分量或生成树结果。"],
    complexity: "邻接表遍历通常 O(V+E)，邻接矩阵遍历通常 O(V²)；空间由图表示决定。",
    invariant: "已标记顶点不会被重复处理，搜索边界完整包含所有已发现但尚未处理的顶点。",
    pitfalls: ["混淆有向边、无向边和权值边的插入方式。", "访问标记初始化或复用错误导致漏访、重复访问。"],
  },
  17: {
    prerequisites: ["贪婪选择性质", "排序、图和优先级队列"],
    steps: ["定义局部选择标准和可行性条件。", "按选择标准取得当前候选。", "若选择保持可行则加入解并更新剩余问题。", "重复直到得到完整解或没有候选。"],
    complexity: "通常由排序 O(n log n) 或优先级队列/图操作决定；具体以候选维护方式为准。",
    invariant: "当前部分解始终可行，并可扩展为算法所证明的最优解。",
    pitfalls: ["只凭直觉采用局部最优而没有贪婪选择证明。", "更新剩余容量、距离或候选集合时遗漏关联状态。"],
  },
  18: {
    prerequisites: ["递归", "分解、求解和合并"],
    steps: ["识别递归基例。", "把原问题划分为规模更小的子问题。", "递归求解各子问题。", "合并子结果得到原问题答案。"],
    complexity: "由子问题数量、缩小比例和合并成本形成递归式；常见排序为 O(n log n)。",
    invariant: "每个递归调用只处理其指定区间，返回时该区间已经满足调用约定。",
    pitfalls: ["划分区间不缩小导致无限递归。", "合并阶段边界或临时数组下标出错。"],
  },
  19: {
    prerequisites: ["最优子结构", "重叠子问题与状态转移"],
    steps: ["定义能唯一描述子问题的状态。", "写出状态之间的转移关系。", "确定基例与计算顺序。", "保存最优值并按需要回溯构造解。"],
    complexity: "通常等于状态数量乘以每个状态的转移成本，空间等于保存的状态表规模。",
    invariant: "计算某状态时，其依赖状态已经正确求得，表项始终代表定义中的最优子问题值。",
    pitfalls: ["状态定义缺少必要维度，导致不同子问题被错误合并。", "初始化值、遍历方向或不可达状态处理错误。"],
  },
  20: {
    prerequisites: ["状态空间树", "深度优先搜索与可行性剪枝"],
    steps: ["定义结点状态和下一层选择。", "深度优先尝试一个候选选择。", "不可行或不可能改进时剪枝。", "回退现场并尝试下一个分支。"],
    complexity: "最坏通常为指数级；有效约束和上界能显著减少实际搜索结点数，递归空间与搜索深度成正比。",
    invariant: "递归现场准确表示从根到当前结点的选择，回溯后恢复到进入该分支前的状态。",
    pitfalls: ["回溯时未撤销选择造成状态污染。", "剪枝条件过强漏掉可行最优解，或过弱失去效果。"],
  },
  21: {
    prerequisites: ["状态空间树", "队列、优先队列和界函数"],
    steps: ["从根结点生成活结点。", "按 FIFO 或最优界选择下一个扩展结点。", "计算子结点的可行性和界。", "剪除不可能优于当前最优解的分支并继续。"],
    complexity: "最坏仍为指数级；时间取决于扩展结点数，空间取决于同时保留的活结点数。",
    invariant: "活结点集合包含所有尚可能产生更优解的分支，当前最优值来自已验证的可行解。",
    pitfalls: ["把上界和下界方向用反，错误剪除最优分支。", "优先队列比较规则与目标最大化/最小化不一致。"],
  },
};

function withOverrides(base: GuideCore, overrides: Partial<GuideCore>): GuideCore {
  return {
    prerequisites: overrides.prerequisites ?? base.prerequisites,
    steps: overrides.steps ?? base.steps,
    complexity: overrides.complexity ?? base.complexity,
    invariant: overrides.invariant ?? base.invariant,
    pitfalls: overrides.pitfalls ?? base.pitfalls,
  };
}

function algorithmOverrides(item: TextbookCodeItem): Partial<GuideCore> {
  const name = item.sourceFile.toLowerCase();

  if (name.includes("arraylist")) return {
    prerequisites: ["线性表 ADT 的 get、indexOf、insert、erase", "动态数组、模板类和 STL copy/copy_backward"],
    steps: ["构造时校验初始容量并分配 element 数组。", "访问前用 checkIndex 验证下标。", "插入时必要则扩容，再从后向前移动元素并写入新值。", "删除时左移后继元素并缩减 listSize。"],
    complexity: "get 为 O(1)，indexOf、insert、erase 为 O(n)；扩容复制为 O(n)，倍增策略使连续尾插具有均摊 O(1) 成本。",
    invariant: "始终满足 0 ≤ listSize ≤ arrayLength，且 element[0..listSize-1] 是全部有效元素。",
    pitfalls: ["扩容后仍使用旧数组指针或旧容量。", "copy_backward 的目标尾位置计算错误会覆盖待移动元素。"],
  };

  if (name.includes("quicksort")) return {
    prerequisites: ["递归和区间边界", "枢轴选择与原地划分"],
    steps: ["选择枢轴并保存当前处理区间。", "从两端扫描，把小元素移到左侧、大元素移到右侧。", "枢轴就位后得到两个子区间。", "递归排序左右子区间，直到区间长度小于 2。"],
    complexity: "平均时间 O(n log n)，最坏 O(n²)；递归栈平均 O(log n)、最坏 O(n)。",
    invariant: "划分过程中，左侧已确认元素不大于枢轴，右侧已确认元素不小于枢轴，未处理区间持续缩小。",
    pitfalls: ["重复元素下扫描指针不前进而形成死循环。", "子区间端点仍包含已就位枢轴，导致无限递归。"],
  };

  if (name.includes("mergesort")) return {
    prerequisites: ["递归分治", "有序区间合并和临时数组"],
    steps: ["把当前区间分成左右两半。", "递归使两个子区间分别有序。", "双指针比较两侧当前元素并写入临时区。", "复制剩余元素并把合并结果写回原区间。"],
    complexity: "时间 O(n log n)，辅助数组空间 O(n)，递归栈 O(log n)。",
    invariant: "合并时临时区前缀始终是两个已消费前缀的有序并集。",
    pitfalls: ["漏复制某一侧剩余元素。", "临时数组与原数组的区间起点不一致造成错位。"],
  };

  if (/selectionsort|bubblesort|insertionsort|ranksort/.test(name)) return {
    prerequisites: ["数组下标与元素交换", "排序区间和循环不变量"],
    steps: ["划分已排序区与未排序区。", "在未排序区比较、移动或交换元素。", "每轮固定至少一个元素的最终位置。", "重复直到未排序区为空。"],
    complexity: name.includes("insertion")
      ? "插入排序最好 O(n)，平均和最坏 O(n²)，额外空间 O(1)。"
      : "主要比较次数为平方级，平均和最坏时间 O(n²)，额外空间 O(1)。",
    invariant: "每轮结束后，已排序区内部有序，并由原数组中对应数量的元素组成。",
    pitfalls: ["交换式插入与移动式插入混用导致元素丢失。", "循环边界少比较或多访问一个元素。"],
  };

  if (name.includes("binarysearch") || name.includes("sequentialsearch")) return {
    prerequisites: ["数组与关键字比较", name.includes("binary") ? "有序序列和区间缩半" : "顺序扫描"],
    steps: name.includes("binary")
      ? ["初始化左右搜索边界。", "计算中点并比较目标。", "根据比较结果排除一半区间。", "命中返回位置，区间为空则返回未找到。"]
      : ["从首元素开始建立当前位置。", "逐项与目标关键字比较。", "命中时立即返回位置。", "扫描结束仍未命中则返回失败标记。"],
    complexity: name.includes("binary") ? "时间 O(log n)，额外空间 O(1)。" : "最好 O(1)，最坏和平均时间 O(n)，额外空间 O(1)。",
    invariant: name.includes("binary") ? "若目标存在，它始终位于当前搜索区间内。" : "已扫描前缀中不存在尚未报告的目标元素。",
    pitfalls: ["失败返回值与合法下标混淆。", name.includes("binary") ? "无序数据或边界更新不收缩。" : "循环上界越过数组末端。"],
  };

  if (name.includes("bellman") || (item.chapter === 19 && name === "graph.h")) return {
    prerequisites: ["带权有向图", "路径松弛、负权边和前驱数组"],
    steps: ["把源点距离设为 0，其余距离设为不可达。", "按边或活动顶点反复执行松弛。", "距离改善时记录前驱，并让相关顶点进入下一轮。", "轮次结束后由距离与前驱数组读取结果；需要时继续检查负权回路。"],
    complexity: "经典 Bellman-Ford 时间 O(VE)，空间 O(V)；教材的活动表优化可减少实际松弛，但不改变最坏界。",
    invariant: "第 k 轮后，距离值不大于所有最多使用 k 条边的已发现路径长度；每次松弛只会改善上界。",
    pitfalls: ["把不可达值直接与边权相加导致溢出。", "忘记负权边允许后续继续改善距离，过早结束。"],
  };

  if (/bfs|dfs|adjacency|linked.*graph|^graph\./.test(name)) return {
    prerequisites: ["图的顶点与边", "邻接矩阵/邻接表及访问标记"],
    steps: ["初始化图存储和顶点访问状态。", "从指定顶点枚举相邻边。", "对未访问顶点记录状态并加入搜索边界。", "持续扩展直到边界为空，再整理路径、树或连通结果。"],
    complexity: name.includes("adjacency") ? "邻接矩阵通常需要 O(V²) 空间，遍历 O(V²)；邻接表空间 O(V+E)，遍历 O(V+E)。" : "复杂度取决于具体图表示：邻接表通常 O(V+E)，邻接矩阵通常 O(V²)。",
    invariant: "每个已标记顶点只被正式处理一次，所有已发现未处理顶点都保存在搜索边界中。",
    pitfalls: ["无向图只插入一个方向的边。", "跨多次搜索复用 visited/reach 标记而未重新初始化。"],
  };

  if (name.includes("heap") || name.includes("hblt") || name.includes("priorityqueue")) return {
    prerequisites: ["优先级队列", "完全二叉树、堆序或左高性质"],
    steps: ["确认根结点保存当前最高优先级元素。", "插入时从新位置向上比较并调整。", "删除根时填入替代元素并向下选择更优孩子。", "直到局部关系恢复，再更新结构大小。"],
    complexity: "插入、删除为 O(log n)，读取根为 O(1)；线性建堆为 O(n)。",
    invariant: "根保持全局最高优先级，且每个父子位置都满足堆序或左高结构约束。",
    pitfalls: ["下沉时没有选择两个孩子中优先级更高者。", "堆大小变化与数组有效区间不同步。"],
  };

  if (name.includes("skiplist")) return {
    prerequisites: ["有序链表", "随机层级与多级前向指针"],
    steps: ["从最高层头结点开始搜索。", "在当前层向右移动到不超过目标的位置。", "逐层下降并保存各层前驱。", "插入或删除时按随机高度更新相关层链接。"],
    complexity: "期望查找、插入、删除 O(log n)，最坏 O(n)，空间期望 O(n)。",
    invariant: "每一层都按关键字有序，高层结点同时存在于所有更低层。",
    pitfalls: ["随机高度超过最大层数。", "插入/删除只更新部分层，留下悬空或跳过目标的链接。"],
  };

  if (/hash|threetolong|stringtoint/.test(name)) return {
    prerequisites: ["字典关键字", "散列函数、装载因子和冲突处理"],
    steps: ["把关键字稳定转换为整数散列值。", "映射到表内初始地址。", "按线性探查或链表继续处理冲突。", "命中、找到空位或遍历结束后完成操作。"],
    complexity: "装载因子受控时平均查找和更新 O(1)，严重冲突时最坏 O(n)。",
    invariant: "每条记录都位于其散列地址对应的可达探查序列或冲突链中。",
    pitfalls: ["负散列值或整数溢出导致非法下标。", "开放定址删除直接置空，截断后续元素的探查链。"],
  };

  if (/compress|decompress/.test(name)) return {
    prerequisites: ["LZW 字典编码", "散列表、位打包和文件流"],
    steps: ["初始化基础字符字典。", "逐字符扩展当前最长已知串。", "无法继续匹配时输出/读取代码并新增字典项。", "按固定代码宽度打包或还原数据直到结束。"],
    complexity: "在散列字典平均 O(1) 操作下，时间 O(n)，字典空间受代码宽度上限约束。",
    invariant: "编码器与解码器以相同顺序扩展字典，当前代码始终代表已知字符串。",
    pitfalls: ["忽略解码时“代码等于下一字典编号”的特殊情况。", "位缓冲移位宽度或文件结束处理不一致。"],
  };

  if (/binarytree|linkedbinarytree|traversal|infix|booster/.test(name)) return {
    prerequisites: ["二叉树结点", "递归与前序/中序/后序/层序遍历"],
    steps: ["从根结点进入当前子树。", "按算法规定的顺序处理根、左子树和右子树。", "在访问点完成输出、计算或状态合并。", "空子树直接返回，逐层汇总结果。"],
    complexity: "遍历每个结点一次，时间 O(n)；递归空间 O(h)，层序遍历队列空间最坏 O(n)。",
    invariant: "每个结点按指定次序恰好访问一次，递归调用只修改其负责子树的状态。",
    pitfalls: ["访问根的位置错误导致遍历序列混淆。", "复制、清空或析构时遗漏某个子树。"],
  };

  if (/binarysearchtree|bstree|histogram|crossings|bestfit/.test(name)) return {
    prerequisites: ["二叉搜索树", "关键字比较与结点删除"],
    steps: ["从根结点比较目标关键字。", "沿左/右子树定位记录或插入位置。", "更新时处理零、一个或两个孩子的结构。", "重新连接结点并验证整棵树有序。"],
    complexity: "操作时间 O(h)，平均 O(log n)，树退化时 O(n)。",
    invariant: "每个结点左侧关键字更小、右侧关键字更大；附加统计字段与子树内容一致。",
    pitfalls: ["删除双孩子结点后重复保留替代关键字。", "父指针、子树根或索引字段没有同步更新。"],
  };

  if (/unionfind|equivnode|fastunion/.test(name)) return {
    prerequisites: ["等价关系", "树表示、按重量合并和路径压缩"],
    steps: ["把每个元素初始化为独立集合。", "find 沿父链接寻找集合代表。", "unite 把两个不同代表连接。", "按需要用重量规则和路径压缩缩短后续路径。"],
    complexity: "简单数组合并可能 O(n)；按秩/重量合并配合路径压缩后，均摊复杂度接近 O(α(n))。",
    invariant: "每个元素沿父链接最终到达唯一代表，根结点正确记录集合大小或秩。",
    pitfalls: ["未对代表执行合并，形成环或破坏大小信息。", "路径压缩更新顺序错误导致父链接丢失。"],
  };

  if (/hanoi/.test(name)) return {
    prerequisites: ["递归调用栈", "汉诺塔合法移动规则"],
    steps: ["把 n-1 个盘从源柱移到辅助柱。", "把最大盘移到目标柱。", "把 n-1 个盘从辅助柱移到目标柱。", "n=0 时结束当前递归。"],
    complexity: "时间 O(2^n)，递归栈空间 O(n)。",
    invariant: "任意柱上的盘始终从下到上由大到小，且一次只移动一个顶盘。",
    pitfalls: ["递归参数中辅助柱与目标柱顺序写反。", "缺少 n=0 基例导致无限递归。"],
  };

  if (/maze|wirerouter|componentlabeling|railroad|switchbox|equivalenceclasses/.test(name)) return {
    prerequisites: ["栈或队列", "状态标记与邻接位置生成"],
    steps: ["把初始对象加入待处理容器并标记。", "取出一个状态，枚举可行后继。", "保存新状态、前驱或所属类别。", "找到目标或容器为空后恢复并输出结果。"],
    complexity: "每个可达状态通常至多处理一次，时间和空间均与状态数及其邻接关系成正比。",
    invariant: "容器中只保存已发现但尚未处理的状态，标记阻止同一状态重复加入。",
    pitfalls: ["标记发生得太晚，同一状态被重复入栈/入队。", "恢复路径时前驱方向或终止条件错误。"],
  };

  if (/machineshop|task\.h|job\.h|machine\.h|eventlist/.test(name)) return {
    prerequisites: ["队列", "离散事件仿真和事件时间"],
    steps: ["初始化机器、作业队列与首批事件。", "选择时间最早的下一事件并推进仿真时钟。", "完成任务、转移作业并更新机器状态。", "生成新的完成事件，直到所有作业结束。"],
    complexity: "取决于事件数及事件表实现；顺序事件表可能 O(E·M)，优先队列可降为约 O(E log M)。",
    invariant: "仿真时钟单调不减，每台机器的当前任务、等待队列和完成时间相互一致。",
    pitfalls: ["同一时刻多事件的处理次序不一致。", "机器空闲时间、等待时间或下一工序索引更新遗漏。"],
  };

  if (/knapsack/.test(name)) return {
    prerequisites: ["0/1 背包状态定义", item.chapter === 19 ? "动态规划" : item.chapter === 20 ? "回溯与上界" : "分支定界与优先队列"],
    steps: item.chapter === 19
      ? ["用物品编号和剩余容量定义状态。", "比较选择与不选择当前物品的价值。", "按依赖顺序保存最优子问题值。", "从状态表或决策记录恢复选择方案。"]
      : ["按物品层次生成选择与不选择分支。", "更新当前重量、价值和剩余价值界。", "超重或上界不优时剪枝。", "到达叶结点或更优可行解时更新答案。"],
    complexity: item.chapter === 19 ? "容量为 C、物品数为 n 时典型时间 O(nC)，空间 O(nC) 或滚动优化为 O(C)。" : "最坏 O(2^n)，实际性能取决于排序和界函数的剪枝强度。",
    invariant: item.chapter === 19 ? "每个状态保存指定物品范围与容量下的最优价值。" : "当前结点状态准确对应已做选择，界值不低估该分支可能取得的最优价值。",
    pitfalls: ["0/1 背包原地更新容量时方向错误，变成完全背包。", "界函数忽略已用容量或剩余物品顺序。"],
  };

  if (/matrixchain/.test(name)) return {
    prerequisites: ["矩阵乘法维度", "区间动态规划"],
    steps: ["按矩阵区间定义最少乘法次数。", "枚举区间内最后一次分割位置。", "组合左右区间代价与本次乘法代价。", "保存最小值及分割点并恢复括号化方案。"],
    complexity: "n 个矩阵的标准动态规划时间 O(n³)，空间 O(n²)。",
    invariant: "计算长度为 L 的区间时，所有更短子区间的最优代价已经正确。",
    pitfalls: ["维度数组下标与矩阵编号错一位。", "只保存最小代价却没有保存恢复方案所需的分割点。"],
  };

  if (/loading/.test(name)) return {
    prerequisites: ["货箱装载约束", item.chapter === 17 ? "贪婪排序" : item.chapter === 20 ? "回溯" : "分支定界"],
    steps: item.chapter === 17
      ? ["按货箱重量从小到大排序。", "初始化剩余载重和选择向量。", "依次选择仍能装入的最轻货箱。", "更新剩余载重直到下一箱无法装入。"]
      : ["按货箱层次生成装入和不装入分支。", "维护当前载重及剩余重量界。", "超载或不可能改善时剪枝。", "发现更优可行装载时更新最优解。"],
    complexity: item.chapter === 17 ? "排序 O(n log n)，扫描 O(n)，总时间 O(n log n)。" : "最坏 O(2^n)，界函数可减少实际扩展结点。",
    invariant: "当前选择向量始终可行；搜索算法的界值覆盖该分支尚可能取得的最好结果。",
    pitfalls: ["把最大装载重量与最大装载数量的目标混淆。", "更新最优解时没有同步复制选择向量。"],
  };

  if (/tileboard|closestpoints|select\.cpp|minmax3/.test(name)) return {
    prerequisites: ["分治递归", "子问题划分和结果合并"],
    steps: ["识别最小规模直接解。", "按几何或下标位置划分子问题。", "递归求解各部分。", "比较或合并跨分区候选得到整体结果。"],
    complexity: name.includes("closest") ? "典型分治最近点对为 O(n log n)，需要有序辅助结构。" : "复杂度由递归式决定；每层线性合并时常见为 O(n log n)。",
    invariant: "每个递归调用完整解决其负责范围，合并时只需补充跨分区候选。",
    pitfalls: ["递归区间没有严格缩小。", "合并时漏掉跨越分界线的候选解。"],
  };

  if (/recursivebt|iterativebt|bbboard|leastcost/.test(name)) return {
    prerequisites: ["状态空间树", item.chapter === 20 ? "深度优先回溯" : "分支定界与界函数"],
    steps: ["用层号和当前部分解描述结点。", "生成当前选择的各个子结点。", "依据约束和界值剪除无希望分支。", "恢复状态或选择下一活结点，直到搜索结束。"],
    complexity: "最坏为指数级；空间在深度优先时与深度相关，在分支定界时与活结点数相关。",
    invariant: "结点保存的部分解、约束状态和界值相互一致，所有被保留分支仍可能产生有效改进。",
    pitfalls: ["回溯后未恢复共享数组。", "最小化问题与最大化问题的界值比较方向相反。"],
  };

  return {};
}

export function getTextbookCodeGuide(item: TextbookCodeItem): TextbookCodeGuide {
  const base = chapterDefaults[item.chapter] ?? chapterDefaults[1];
  const guide = withOverrides(base, algorithmOverrides(item));
  const programs = item.programNumbers.length === 1
    ? `程序 ${item.programNumbers[0]}`
    : `程序 ${item.programNumbers.join("、")}`;

  return {
    textbookScope: `第 ${item.chapter} 章「${chapterNames[item.chapter] ?? "教材程序"}」· ${programs} · ${item.sourceFile}`,
    ...guide,
  };
}
