import { env } from "cloudflare:workers";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { resources } from "@/db/schema";

export async function GET() {
  try {
    const items = await getDb().select().from(resources).orderBy(desc(resources.createdAt), desc(resources.id)).limit(100);
    return Response.json({ resources: items });
  } catch (error) {
    console.error("Unable to load resources", error);
    return Response.json({ resources: [], persistence: "unavailable" });
  }
}

export async function POST(request: Request) {
  try {
    if (!env.BUCKET) return Response.json({ error: "资料存储暂不可用" }, { status: 503 });
    const data = await request.formData();
    const file = data.get("file");
    const courseId = String(data.get("courseId") || "data-structures");
    if (!(file instanceof File)) return Response.json({ error: "请选择文件" }, { status: 400 });
    if (file.size > 20 * 1024 * 1024) return Response.json({ error: "单个文件不能超过 20MB" }, { status: 400 });
    const storageKey = `${courseId}/${crypto.randomUUID()}-${file.name.replace(/[^\w.\-\u4e00-\u9fa5]/g, "-")}`;
    await env.BUCKET.put(storageKey, file.stream(), { httpMetadata: { contentType: file.type || "application/octet-stream" } });
    const [item] = await getDb().insert(resources).values({ courseId, name: file.name, storageKey, contentType: file.type || "application/octet-stream", size: file.size }).returning();
    return Response.json({ resource: item }, { status: 201 });
  } catch (error) {
    console.error("Unable to upload resource", error);
    return Response.json({ error: "资料上传失败，请稍后重试" }, { status: 500 });
  }
}
