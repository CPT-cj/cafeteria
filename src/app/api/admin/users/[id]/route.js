import { prisma } from "@/lib/prisma";
import { handle, ok, readJson, AppError } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { bool, oneOf } from "@/lib/validate";

export const PATCH = handle(async (req, ctx) => {
  const admin = await requireAdmin();
  const { id } = await ctx.params;
  const b = await readJson(req);
  if (id === admin.id) throw new AppError("نمی‌توانید وضعیت یا نقش حساب خودتان را تغییر دهید.");
  const data = {};
  if (b.isActive !== undefined) data.isActive = bool(b.isActive, "وضعیت");
  if (b.role !== undefined) data.role = oneOf(b.role, ["STUDENT", "ADMIN"], "نقش");
  const user = await prisma.user.update({ where: { id }, data, select: { id: true, role: true, isActive: true } });
  return ok({ user });
});
