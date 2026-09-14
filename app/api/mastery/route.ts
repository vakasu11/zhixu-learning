import { getDb } from "@/db";
import { eq } from "drizzle-orm";
import { mastery } from "@/db/schema";
import { COURSES } from "@/lib/study-content";
import { getVisitor, visitorJson } from "@/lib/visitor";

export async function GET(request: Request) {
  const visitor = getVisitor(request);
  try {
    const records = await getDb().select().from(mastery).where(eq(mastery.visitorId, visitor.id));
    return visitorJson(visitor, { records });
  } catch (error) {
    console.error("Unable to load mastery", error);
    return visitorJson(visitor, { records: [], persistence: "unavailable" });
  }
}

export async function POST(request: Request) {
  const visitor = getVisitor(request);
  try {
    const payload = (await request.json()) as { courseId?: string; topic?: string; level?: number };
    const course = COURSES.find((item) => item.id === payload.courseId);
    if (!course || !payload.topic || !course.chapters.some((chapter) => chapter.topics.includes(payload.topic!))) return visitorJson(visitor, { error: "知识点无效" }, { status: 400 });
    const level = Number(payload.level) > 0 ? 1 : 0;
    const [record] = await getDb().insert(mastery).values({ visitorId: visitor.id, courseId: payload.courseId, topic: payload.topic, level })
      .onConflictDoUpdate({ target: [mastery.visitorId, mastery.courseId, mastery.topic], set: { level } }).returning();
    return visitorJson(visitor, { record });
  } catch (error) {
    console.error("Unable to save mastery", error);
    return visitorJson(visitor, { error: "掌握状态暂时无法保存" }, { status: 500 });
  }
}
