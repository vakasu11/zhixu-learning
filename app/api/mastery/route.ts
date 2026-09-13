import { getDb } from "@/db";
import { mastery } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { courseId?: string; topic?: string; level?: number };
    if (!payload.courseId || !payload.topic) return Response.json({ error: "缺少知识点" }, { status: 400 });
    const level = Math.max(0, Math.min(4, Number(payload.level ?? 0)));
    const [record] = await getDb().insert(mastery).values({ courseId: payload.courseId, topic: payload.topic, level })
      .onConflictDoUpdate({ target: [mastery.courseId, mastery.topic], set: { level } }).returning();
    return Response.json({ record });
  } catch (error) {
    console.error("Unable to save mastery", error);
    return Response.json({ error: "掌握度暂时无法保存" }, { status: 500 });
  }
}
