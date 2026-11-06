import { prisma } from "@/lib/prisma";
import { handle, ok, readJson, AppError } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { parseFood } from "@/services/admin";

export const PATCH = handle(async (req, ctx) => {
  await requireAdmin();
  const { id } = await ctx.params;
  const b = await readJson(req);
  const exists = await prisma.food.findUnique({ where: { id } });
  if (!exists) throw new AppError("غذا پیدا نشد.", 404);
  const food = await prisma.food.update({ where: { id }, data: parseFood({ ...exists, ...b }) });
  return ok({ food });
});

// اگر غذا سابقه برنامه غذایی دارد، به‌جای حذف، غیرفعال می‌شود تا سوابق مالی سالم بماند.
export const DELETE = handle(async (_req, ctx) => {
  await requireAdmin();
  const { id } = await ctx.params;
  const used = await prisma.foodSchedule.count({ where: { foodId: id } });
  if (used > 0) {
    await prisma.food.update({ where: { id }, data: { isActive: false } });
    return ok({ deactivated: true, message: "این غذا در برنامه غذایی استفاده شده بود؛ به‌جای حذف، غیرفعال شد." });
  }
  await prisma.food.delete({ where: { id } });
  return ok({ deleted: true });
});
