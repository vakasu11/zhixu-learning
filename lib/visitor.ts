const COOKIE_NAME = "zhixu_visitor";

export function getVisitor(request: Request) {
  const cookies = request.headers.get("cookie") ?? "";
  const existing = cookies.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${COOKIE_NAME}=`))?.slice(COOKIE_NAME.length + 1);
  if (existing && /^[a-zA-Z0-9-]{20,80}$/.test(existing)) return { id: existing, isNew: false };
  return { id: crypto.randomUUID(), isNew: true };
}

export function visitorJson(visitor: { id: string; isNew: boolean }, data: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  if (visitor.isNew) headers.set("Set-Cookie", `${COOKIE_NAME}=${visitor.id}; Path=/; Max-Age=31536000; HttpOnly; Secure; SameSite=Lax`);
  return Response.json(data, { ...init, headers });
}
