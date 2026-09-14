import { getDb } from "@/db";
import { chatMessages } from "@/db/schema";
import { buildDetailedAnswer, COURSES, type CourseId } from "@/lib/study-content";
import { getVisitor, visitorJson } from "@/lib/visitor";

export async function POST(request: Request) {
  const visitor = getVisitor(request);
  const payload = (await request.json()) as { courseId?: CourseId; question?: string };
  const courseId = COURSES.some((course) => course.id === payload.courseId) ? payload.courseId! : "data-structures";
  const question = payload.question?.trim() || COURSES.find((course) => course.id === courseId)!.quickQuestions[0];
  const answer = buildDetailedAnswer(courseId, question);

  try {
    await getDb().insert(chatMessages).values([
      { visitorId: visitor.id, courseId, role: "user", content: question },
      { visitorId: visitor.id, courseId, role: "assistant", content: JSON.stringify(answer) },
    ]);
  } catch (error) {
    console.error("Unable to save assistant conversation", error);
  }

  return visitorJson(visitor, { answer });
}
