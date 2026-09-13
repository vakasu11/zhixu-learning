import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { studyTasks } from "@/db/schema";

export async function GET() {
  try {
    const db = getDb();
    let tasks = await db.select().from(studyTasks).orderBy(asc(studyTasks.position), asc(studyTasks.id)).limit(50);
    if (!tasks.length) {
      tasks = await db.insert(studyTasks).values([
        { courseId: "data-structures", course: "数据结构与算法", title: "二叉树遍历与递归", duration: 45, kind: "知识 + 编程", position: 1 },
        { courseId: "networks", course: "计算机网络", title: "理解 TCP 三次握手", duration: 30, kind: "精读", position: 2 },
        { courseId: "probability", course: "概率论与数理统计", title: "离散型随机变量练习", duration: 40, kind: "6 道题", position: 3 },
      ]).returning();
    }
    return Response.json({ tasks });
  } catch (error) {
    console.error("Unable to load study tasks", error);
    return Response.json({ tasks: [], persistence: "unavailable" });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { courseId?: string; course?: string; title?: string; duration?: number; kind?: string };
    if (!payload.courseId || !payload.course || !payload.title?.trim()) return Response.json({ error: "请填写完整任务信息" }, { status: 400 });
    const [task] = await getDb().insert(studyTasks).values({
      courseId: payload.courseId, course: payload.course, title: payload.title.trim(), duration: Math.max(5, Math.min(240, payload.duration ?? 30)), kind: payload.kind || "学习", position: Date.now(),
    }).returning();
    return Response.json({ task }, { status: 201 });
  } catch (error) {
    console.error("Unable to save study task", error);
    return Response.json({ error: "任务暂时无法保存，请稍后重试" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const payload = (await request.json()) as { id?: number; completed?: boolean; courseId?: string; course?: string; title?: string; duration?: number; kind?: string };
    if (!payload.id) return Response.json({ error: "缺少任务编号" }, { status: 400 });
    const db = getDb();
    const existing = await db.select().from(studyTasks).where(eq(studyTasks.id, payload.id)).limit(1);
    let task;
    if (existing.length) {
      [task] = await db.update(studyTasks).set({ completed: Boolean(payload.completed) }).where(eq(studyTasks.id, payload.id)).returning();
    } else {
      [task] = await db.insert(studyTasks).values({ id: payload.id, courseId: payload.courseId || "data-structures", course: payload.course || "数据结构与算法", title: payload.title || "学习任务", duration: payload.duration ?? 30, kind: payload.kind || "学习", completed: Boolean(payload.completed), position: payload.id }).returning();
    }
    return Response.json({ task });
  } catch (error) {
    console.error("Unable to update study task", error);
    return Response.json({ error: "进度暂时无法保存，请稍后重试" }, { status: 500 });
  }
}
