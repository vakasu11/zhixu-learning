import { getTopicDetail } from "@/lib/topic-guides";

export type CourseId = "data-structures" | "networks" | "systems" | "circuits" | "probability";

export type Course = {
  id: CourseId;
  name: string;
  short: string;
  description: string;
  progress: number;
  color: string;
  pale: string;
  current: string;
  chapters: { title: string; topics: string[] }[];
  quickQuestions: string[];
};

export const COURSES: Course[] = [
  {
    id: "data-structures", name: "数据结构与算法", short: "数据结构", description: "理解数据的组织方式，掌握常用算法、复杂度分析与代码实现。", progress: 0, color: "#315f50", pale: "#e8f0ec", current: "从算法基础开始",
    chapters: [
      { title: "算法基础", topics: ["时间复杂度", "空间复杂度", "递归分析"] },
      { title: "线性结构", topics: ["顺序表", "链表", "栈与队列"] },
      { title: "树结构", topics: ["二叉树", "树的遍历", "堆与优先队列", "并查集"] },
      { title: "图结构", topics: ["图的存储", "DFS 与 BFS", "最短路径", "最小生成树"] },
      { title: "查找与排序", topics: ["二分查找", "哈希表", "快速排序", "归并排序"] },
    ], quickQuestions: ["二叉树的三种遍历有什么区别？", "如何分析递归算法复杂度？", "Dijkstra 算法为什么不能处理负权边？"],
  },
  {
    id: "networks", name: "计算机网络", short: "计算机网络", description: "从协议分层到端到端通信，理解数据如何在网络中可靠传输。", progress: 0, color: "#41647a", pale: "#eaf0f4", current: "从网络体系结构开始",
    chapters: [
      { title: "网络体系结构", topics: ["OSI 模型", "TCP/IP 模型", "封装与解封装"] },
      { title: "数据链路层", topics: ["差错检测", "以太网", "交换机", "ARP"] },
      { title: "网络层", topics: ["IPv4", "子网划分", "路由算法", "ICMP"] },
      { title: "传输层", topics: ["UDP", "TCP 三次握手", "可靠传输", "拥塞控制"] },
      { title: "应用层", topics: ["DNS", "HTTP/HTTPS", "电子邮件"] },
    ], quickQuestions: ["TCP 为什么需要三次握手？", "交换机和路由器有什么区别？", "一次网页请求经过了哪些协议？"],
  },
  {
    id: "systems", name: "计算机系统导论", short: "系统导论", description: "从比特、指令到程序运行，建立软硬件协同的完整系统视角。", progress: 0, color: "#6b596f", pale: "#f0ebf1", current: "从信息表示开始",
    chapters: [
      { title: "信息表示", topics: ["二进制", "整数表示", "浮点数", "字符编码"] },
      { title: "处理器", topics: ["指令系统", "数据通路", "流水线", "异常"] },
      { title: "存储系统", topics: ["局部性", "高速缓存", "虚拟内存", "磁盘"] },
      { title: "程序运行", topics: ["编译链接", "进程", "系统调用", "并发"] },
    ], quickQuestions: ["为什么计算机会出现浮点数误差？", "高速缓存为什么能提高性能？", "程序从源代码到运行经历了什么？"],
  },
  {
    id: "circuits", name: "电路与电子技术基础", short: "电路基础", description: "掌握电路分析方法、基本元器件特性与模拟数字电路基础。", progress: 0, color: "#8c623f", pale: "#f4ede6", current: "从电路基本量开始",
    chapters: [
      { title: "电路基本量", topics: ["电压与电流", "参考方向", "功率", "电源"] },
      { title: "电阻电路", topics: ["欧姆定律", "KCL", "KVL", "等效变换"] },
      { title: "动态电路", topics: ["电容", "电感", "一阶电路", "正弦稳态"] },
      { title: "电子器件", topics: ["二极管", "三极管", "运算放大器", "逻辑门"] },
    ], quickQuestions: ["KCL 和 KVL 应该怎样列方程？", "戴维南等效电路怎么求？", "电容和电感的暂态过程如何理解？"],
  },
  {
    id: "probability", name: "概率论与数理统计", short: "概率统计", description: "理解随机现象的数学规律，掌握分布、数字特征与统计推断。", progress: 0, color: "#776733", pale: "#f3f0e4", current: "从概率基础开始",
    chapters: [
      { title: "概率基础", topics: ["样本空间", "条件概率", "全概率公式", "贝叶斯公式"] },
      { title: "随机变量", topics: ["分布函数", "离散型分布", "连续型分布"] },
      { title: "数字特征", topics: ["数学期望", "方差", "协方差", "相关系数"] },
      { title: "极限定理", topics: ["大数定律", "中心极限定理"] },
      { title: "统计推断", topics: ["参数估计", "置信区间", "假设检验"] },
    ], quickQuestions: ["贝叶斯公式应该怎么理解？", "常见概率分布怎样区分？", "中心极限定理有什么实际意义？"],
  },
];

export type DetailedAnswer = {
  title: string;
  course: string;
  summary: string;
  sections: { heading: string; content: string }[];
  keyPoints: string[];
  mistake: string;
  exercise: string;
  answer: string;
  mindMap?: { label: string; items: string[] }[];
};

const answers: Record<string, DetailedAnswer> = {
  tcp: { title: "TCP 为什么需要三次握手？", course: "计算机网络", summary: "三次握手的本质不是单纯“打招呼”，而是让通信双方确认彼此的发送和接收能力，并同步双方各自的初始序列号。", sections: [
    { heading: "1. 前置知识", content: "TCP 是面向连接、可靠、全双工的传输协议。每个方向都拥有独立的序列号空间。建立连接前，客户端与服务器必须知道对方当前选择的初始序列号，否则无法判断后续字节是否丢失、重复或乱序。" },
    { heading: "2. 三次握手过程", content: "第一次：客户端发送 SYN=1、seq=x。第二次：服务器发送 SYN=1、ACK=1、seq=y、ack=x+1。第三次：客户端发送 ACK=1、seq=x+1、ack=y+1。至此双方都获得了双向确认。" },
    { heading: "3. 为什么两次不够", content: "如果只有两次，服务器无法确认客户端是否收到了服务器的 SYN 和初始序列号。旧的、延迟到达的连接请求也可能让服务器误以为新连接已经成立并分配资源。" },
    { heading: "4. 用生活例子理解", content: "甲说：“能听见吗？我的编号是 x。”乙说：“能听见，我的编号是 y，你能听见我吗？”甲再说：“我也能听见。”三句话分别确认了两个方向，并交换了各自编号。" },
  ], keyPoints: ["同步双方初始序列号", "确认双向收发能力", "避免历史请求造成错误连接", "第三次 ACK 通常可以携带数据"], mistake: "常见误区：认为三次握手只是为了确认“网络是通的”。更准确地说，它确认双向通信状态并完成序列号同步。", exercise: "客户端发送 SYN(seq=100)，服务器回复 SYN+ACK(seq=500, ack=101)，第三次报文中的 seq 和 ack 分别是多少？", answer: "seq=101，ack=501。SYN 虽然不携带应用数据，但会占用一个序列号。" },
  tree: { title: "二叉树的三种深度优先遍历", course: "数据结构与算法", summary: "前序、中序和后序的差别只在于“访问根节点”的时机；递归结构始终是处理当前节点及其左右子树。", sections: [
    { heading: "1. 核心定义", content: "前序：根→左→右；中序：左→根→右；后序：左→右→根。“序”描述根节点相对于左右子树的访问位置。" },
    { heading: "2. 递归为什么自然", content: "一棵非空二叉树由根、左子树和右子树组成，左右子树仍然是二叉树。因此遍历整棵树能拆成结构相同的子问题，递归出口是当前节点为空。" },
    { heading: "3. 代码骨架", content: "void dfs(Node* root) { if (!root) return; /* 前序 */ dfs(root->left); /* 中序 */ dfs(root->right); /* 后序 */ }。把访问语句放在不同位置，就得到三种遍历。" },
    { heading: "4. 复杂度", content: "每个节点恰好访问一次，时间复杂度 O(n)。递归栈深度等于树高 h，空间复杂度 O(h)；平衡树约 O(log n)，退化链状树为 O(n)。" },
  ], keyPoints: ["访问根节点的时机决定顺序", "空节点是递归出口", "中序遍历搜索树得到有序序列", "后序适合先处理子树"], mistake: "常见错误：只记遍历结果，不画递归调用栈；遇到复杂树时很容易漏掉返回路径。", exercise: "根为 A，左孩子 B，右孩子 C，B 的右孩子为 D。写出三种遍历序列。", answer: "前序 A-B-D-C；中序 B-D-A-C；后序 D-B-C-A。" },
  cache: { title: "高速缓存为什么能提高性能？", course: "计算机系统导论", summary: "高速缓存利用时间局部性和空间局部性，用少量高速存储保存近期最可能再次使用的数据，缩小处理器与主存的速度差距。", sections: [
    { heading: "1. 性能矛盾", content: "处理器执行速度远快于主存访问速度。如果每条指令都等待主存，CPU 的大量时间会浪费在等待数据上。" },
    { heading: "2. 局部性原理", content: "时间局部性表示刚访问的数据很可能很快再次访问；空间局部性表示访问某地址后，附近地址也很可能被访问。循环变量和顺序遍历数组分别是典型例子。" },
    { heading: "3. 缓存如何工作", content: "缓存以块为单位保存主存内容。CPU 先查询缓存：命中时快速返回；未命中时从下一层取回整个块，并替换某个旧块。" },
    { heading: "4. 平均访问时间", content: "平均访问时间约等于：命中时间 + 未命中率 × 未命中代价。缓存很小，只要命中率足够高，也能显著降低平均访问时间。" },
  ], keyPoints: ["存储层次用容量换速度", "缓存块利用空间局部性", "命中率决定实际收益", "数据布局影响缓存表现"], mistake: "缓存不是让主存本身变快，而是让大多数访问不必到达主存。", exercise: "命中时间 1ns，未命中率 5%，未命中额外代价 80ns，平均访问时间约为多少？", answer: "1 + 0.05 × 80 = 5ns。" },
  circuit: { title: "KCL 与 KVL 怎样列方程？", course: "电路与电子技术基础", summary: "KCL 约束节点电流守恒，KVL 约束闭合回路电压平衡。先统一参考方向和绕行方向，再带符号列式。", sections: [
    { heading: "1. KCL 节点电流定律", content: "任一节点上，流入电流之和等于流出电流之和，也可写成所有支路电流代数和为零。它来源于电荷守恒。" },
    { heading: "2. KVL 回路电压定律", content: "沿任一闭合回路绕行一周，各元件电压升与电压降的代数和为零，体现能量守恒。" },
    { heading: "3. 标准解题步骤", content: "标注支路电流参考方向；选择独立节点或回路；规定绕行方向；按参考方向写元件关系；最后联立求解。负结果只表示真实方向与假设相反。" },
    { heading: "4. 符号判断", content: "沿回路从元件负端走向正端记为电压升，反之记为电压降。电阻若采用关联参考方向，可直接用 u=Ri。" },
  ], keyPoints: ["KCL 对节点列式", "KVL 对回路列式", "参考方向可任意假设", "负结果不等于算错"], mistake: "常见错误：列式过程中临时改变电流方向，导致同一个变量在不同方程中的符号不一致。", exercise: "某节点有 2A 和 3A 电流流入，另有 I 电流流出。I 为多少？", answer: "I=2+3=5A。" },
  bayes: { title: "怎样真正理解贝叶斯公式？", course: "概率论与数理统计", summary: "贝叶斯公式描述的是：观察到新证据后，如何把原来的先验判断更新为后验判断。", sections: [
    { heading: "1. 公式", content: "P(A|B)=P(B|A)P(A)/P(B)。P(A) 是先验概率，P(B|A) 是似然，P(A|B) 是观察证据后的后验概率。" },
    { heading: "2. 分母怎么得到", content: "当 A 与其补集构成完备事件组，P(B)=P(B|A)P(A)+P(B|非A)P(非A)。分母是所有原因下出现证据 B 的总概率。" },
    { heading: "3. 检测例子", content: "患病率 1%，检测灵敏度 99%，误报率 5%。检测阳性并不表示患病概率为 99%；代入公式后，阳性者真正患病概率约为 16.7%。" },
    { heading: "4. 解题识别", content: "题目若给出“原因导致结果”的概率，却询问“看到结果后原因成立”的概率，通常需要贝叶斯公式。先画原因树，再沿路径相乘并求和。" },
  ], keyPoints: ["先验 × 似然 → 后验", "分母用全概率公式", "不能忽略基础概率", "条件概率方向不能交换"], mistake: "常见错误：把 P(A|B) 与 P(B|A) 当成同一个概率。二者条件方向相反。", exercise: "两个盒子等概率选择。盒1有 2 红 1 白，盒2有 1 红 2 白。抽到红球后，它来自盒1的概率？", answer: "(2/3×1/2) ÷ (2/3×1/2+1/3×1/2)=2/3。" },
};

export function buildDetailedAnswer(courseId: CourseId, question: string): DetailedAnswer {
  const normalized = question.toLowerCase();
  if (normalized.includes("tcp") || normalized.includes("握手")) return answers.tcp;
  if (normalized.includes("树") || normalized.includes("遍历") || normalized.includes("递归")) return answers.tree;
  if (normalized.includes("缓存") || normalized.includes("cache") || normalized.includes("局部性")) return answers.cache;
  if (normalized.includes("kcl") || normalized.includes("kvl") || normalized.includes("基尔霍夫")) return answers.circuit;
  if (normalized.includes("贝叶斯") || normalized.includes("条件概率")) return answers.bayes;
  const course = COURSES.find((item) => item.id === courseId) ?? COURSES[0];
  const topic = course.chapters.flatMap((chapter) => chapter.topics).find((item) => normalized.includes(item.toLowerCase()));
  if (topic) return getTopicDetail(course, topic);
  const fallback: Record<CourseId, string> = { "data-structures": "tree", networks: "tcp", systems: "cache", circuits: "circuit", probability: "bayes" };
  const base = answers[fallback[courseId]];
  return { ...base, title: question.trim() || base.title };
}
