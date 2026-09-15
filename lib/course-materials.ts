import type { CourseId } from "@/lib/study-content";

export type MaterialRole = {
  name: string;
  priority: "主线" | "校验" | "补充" | "自测";
  use: string;
  reason: string;
};

export type CourseMaterialAudit = {
  courseId: CourseId;
  status: "已完成目录盘点" | "等待盘点";
  summary: string;
  primarySource: string;
  nextStep: string;
  files?: string[];
};

export const MATERIAL_ROLES: MaterialRole[] = [
  { name: "课程 PPT", priority: "主线", use: "确定老师的讲授顺序、课堂重点和图示", reason: "最贴近本校课堂，适合先搭建每章知识骨架。" },
  { name: "指定课本", priority: "校验", use: "补足定义、推导、C++ 实现与边界条件", reason: "内容完整、表述严谨，用来避免课件过度省略。" },
  { name: "个人笔记", priority: "补充", use: "收集易错点、记忆口诀和课堂提醒", reason: "适合补充老师强调但教材未突出的细节。" },
  { name: "练习与试题", priority: "自测", use: "每个知识点只选一道代表题检验理解", reason: "不把刷题当主线，保持知识解析的阅读节奏。" },
];

const DATA_STRUCTURE_PPTS = [
  "ch0.pdf", "ch1.pdf", "ch2.pdf", "ch3-4.pdf", "ch3-4-22.pdf", "ch5.pdf",
  "ch6.pdf", "ch6-v3.pdf", "ch7.pdf", "ch7 (1).pdf", "ch7-v2.pdf", "ch8.pdf",
  "ch9.pdf", "ch10.pdf", "ch11.pdf", "ch12.pdf", "ch12-更新版.pdf", "ch13.pdf",
  "ch14.pdf", "ch15.pdf", "ch16 (1).pdf", "ch17.pdf", "ch18.pdf", "ch19.pdf", "ch19-v2.pdf",
];

export const COURSE_MATERIAL_AUDITS: CourseMaterialAudit[] = [
  {
    courseId: "data-structures",
    status: "已完成目录盘点",
    summary: "资料库包含个人笔记、电子书、练习题目、考研辅导、考试题和课程 PPT 六类内容；课程 PPT 目录共有 25 份 PDF，覆盖 ch0—ch19。",
    primarySource: "课程 PPT +《数据结构、算法与应用（C++语言描述·第2版）》",
    nextStep: "逐章抽取课件正文和图表，与现有 21 章课本大纲对齐；存在多个版本时先比较更新时间和内容完整度，再确定主版本。",
    files: DATA_STRUCTURE_PPTS,
  },
  {
    courseId: "networks",
    status: "等待盘点",
    summary: "已记录学校资料库入口，下一轮按课程 PPT、教材/讲义、实验、试题四类整理。",
    primarySource: "优先选择课程 PPT 与协议流程图",
    nextStep: "先盘点分层、链路层、网络层、传输层和应用层资料，再对齐网站章节。",
  },
  {
    courseId: "systems",
    status: "等待盘点",
    summary: "已记录学校资料库入口，重点寻找位级表示、汇编、处理器、存储层次和程序运行资料。",
    primarySource: "课程 PPT + 系统结构图",
    nextStep: "优先筛选带数据通路、缓存和虚拟内存示意图的课件。",
  },
  {
    courseId: "probability",
    status: "等待盘点",
    summary: "已记录学校资料库入口，重点区分概念讲义、公式表、例题和历年题。",
    primarySource: "课程讲义 + 定理推导",
    nextStep: "先梳理分布、数字特征、极限定理和统计推断，再少量选题验证。",
  },
  {
    courseId: "circuits",
    status: "等待盘点",
    summary: "已记录学校资料库入口，重点寻找电路图、器件特性曲线和分步分析示例。",
    primarySource: "课程 PPT + 电路图示",
    nextStep: "优先筛选图示清晰、参考方向统一、推导步骤完整的资料。",
  },
];

export function getCourseMaterialAudit(courseId: CourseId) {
  return COURSE_MATERIAL_AUDITS.find((item) => item.courseId === courseId) ?? COURSE_MATERIAL_AUDITS[0];
}
