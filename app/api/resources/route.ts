import { env } from "cloudflare:workers";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { resources } from "@/db/schema";
import { getVisitor, visitorJson } from "@/lib/visitor";

export async function GET(request: Request) {
  const visitor = getVisitor(request);
  try {
    const items = await getDb().select().from(resources).where(eq(resources.visitorId, visitor.id)).orderBy(desc(resources.createdAt), desc(resources.id)).limit(100);
    return visitorJson(visitor, { resources: items });
  } catch (error) {
    console.error("Unable to load resources", error);
    return visitorJson(visitor, { resources: [], persistence: "unavailable" });
  }
}

export async function POST(request: Request) {
  const visitor = getVisitor(request);
  try {
    if (!env.BUCKET) return visitorJson(visitor, { error: "资料存储暂不可用" }, { status: 503 });
    const data = await request.formData();
    const file = data.get("file");
    const courseId = String(data.get("courseId") || "data-structures");
    if (!(file instanceof File)) return visitorJson(visitor, { error: "请选择文件" }, { status: 400 });
    if (file.size > 20 * 1024 * 1024) return visitorJson(visitor, { error: "单个文件不能超过 20MB" }, { status: 400 });
    const storageKey = `${visitor.id}/${courseId}/${crypto.randomUUID()}-${file.name.replace(/[^\w.\-\u4e00-\u9fa5]/g, "-")}`;
    await env.BUCKET.put(storageKey, file.stream(), { httpMetadata: { contentType: file.type || "application/octet-stream" } });
    const [item] = await getDb().insert(resources).values({ visitorId: visitor.id, courseId, name: file.name, storageKey, contentType: file.type || "application/octet-stream", size: file.size }).returning();
    return visitorJson(visitor, { resource: item }, { status: 201 });
  } catch (error) {
    console.error("Unable to upload resource", error);
    return visitorJson(visitor, { error: "资料上传失败，请稍后重试" }, { status: 500 });
  }
}
