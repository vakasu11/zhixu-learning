import { and, asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { studyTasks } from "@/db/schema";
import { getVisitor, visitorJson } from "@/lib/visitor";

export async function GET(request: Request) {
  const visitor = getVisitor(request);
  try {
    const db = getDb();
    let tasks = await db.select().from(studyTasks).where(eq(studyTasks.visitorId, visitor.id)).orderBy(asc(studyTasks.position), asc(studyTasks.id)).limit(50);
    if (!tasks.length) {
      tasks = await db.insert(studyTasks).values([
        { visitorId: visitor.id, courseId: "data-structures", course: "数据结构与算法", title: "二叉树遍历与递归", duration: 45, kind: "知识 + 编程", position: 1 },
        { visitorId: visitor.id, courseId: "networks", course: "计算机网络", title: "理解 TCP 三次握手", duration: 30, kind: "精读", position: 2 },
        { visitorId: visitor.id, courseId: "probability", course: "概率论与数理统计", title: "离散型随机变量练习", duration: 40, kind: "6 道题", position: 3 },
      ]).returning();
    }
    return visitorJson(visitor, { tasks });
  } catch (error) {
    console.error("Unable to load study tasks", error);
    return visitorJson(visitor, { tasks: [], persistence: "unavailable" });
  }
}

export async function POST(request: Request) {
  const visitor = getVisitor(request);
  try {
    const payload = (await request.json()) as { courseId?: string; course?: string; title?: string; duration?: number; kind?: string };
    if (!payload.courseId || !payload.course || !payload.title?.trim()) return visitorJson(visitor, { error: "请填写完整任务信息" }, { status: 400 });
    const [task] = await getDb().insert(studyTasks).values({
      visitorId: visitor.id, courseId: payload.courseId, course: payload.course, title: payload.title.trim(), duration: Math.max(5, Math.min(240, payload.duration ?? 30)), kind: payload.kind || "学习", position: Date.now(),
    }).returning();
    return visitorJson(visitor, { task }, { status: 201 });
  } catch (error) {
    console.error("Unable to save study task", error);
    return visitorJson(visitor, { error: "任务暂时无法保存，请稍后重试" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const visitor = getVisitor(request);
  try {
    const payload = (await request.json()) as { id?: number; completed?: boolean; courseId?: string; course?: string; title?: string; duration?: number; kind?: string };
    if (!payload.id) return visitorJson(visitor, { error: "缺少任务编号" }, { status: 400 });
    const db = getDb();
    const existing = await db.select().from(studyTasks).where(and(eq(studyTasks.id, payload.id), eq(studyTasks.visitorId, visitor.id))).limit(1);
    if (!existing.length) return visitorJson(visitor, { error: "未找到当前设备的任务" }, { status: 404 });
    const [task] = await db.update(studyTasks).set({ completed: Boolean(payload.completed) }).where(and(eq(studyTasks.id, payload.id), eq(studyTasks.visitorId, visitor.id))).returning();
    return visitorJson(visitor, { task });
  } catch (error) {
    console.error("Unable to update study task", error);
    return visitorJson(visitor, { error: "进度暂时无法保存，请稍后重试" }, { status: 500 });
  }
}
