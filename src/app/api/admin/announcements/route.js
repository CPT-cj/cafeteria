import { prisma } from "@/lib/prisma";
import { handle, ok, readJson } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { str } from "@/lib/validate";

export const GET = handle(async () => {
  await requireAdmin();
  return ok({ announcements: await prisma.announcement.findMany({ orderBy: { createdAt: "desc" }, take: 50 }) });
});

export const POST = handle(async (req) => {
  await requireAdmin();
  const b = await readJson(req);
  const announcement = await prisma.announcement.create({ data: { title: str(b.title, "عنوان", { max: 120 }), body: str(b.body, "متن اطلاعیه", { max: 1000 }) } });
  return ok({ announcement }, 201);
});
