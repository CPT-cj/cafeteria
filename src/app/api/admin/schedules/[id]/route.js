import { prisma } from "@/lib/prisma";
import { handle, ok, readJson, AppError } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { bool, int, timeString, tehranInstant } from "@/lib/validate";
import { dayText } from "@/services/admin";

export const PATCH = handle(async (req, ctx) => {
  await requireAdmin();
  const { id } = await ctx.params;
  const b = await readJson(req);
  const s = await prisma.foodSchedule.findUnique({ where: { id } });
  if (!s) throw new AppError("برنامه غذایی پیدا نشد.", 404);
  const data = {};
  if (b.capacity !== undefined) {
    data.capacity = int(b.capacity, "ظرفیت", { min: 1, max: 100_000 });
    if (data.capacity < s.reservedCount) throw new AppError("ظرفیت نمی‌تواند کمتر از تعداد رزروهای فعال باشد.");
  }
  if (b.price !== undefined) data.price = int(b.price, "قیمت", { min: 0, max: 10_000_000 });
  if (b.isActive !== undefined) data.isActive = bool(b.isActive, "وضعیت");
  if (b.deadlineTime !== undefined) data.reserveDeadline = tehranInstant(dayText(s.date), timeString(b.deadlineTime, "ساعت پایان مهلت"));
  return ok({ schedule: await prisma.foodSchedule.update({ where: { id }, data }) });
});

export const DELETE = handle(async (_req, ctx) => {
  await requireAdmin();
  const { id } = await ctx.params;
  if ((await prisma.reservation.count({ where: { scheduleId: id } })) > 0)
    throw new AppError("برای این وعده رزرو ثبت شده است؛ به‌جای حذف، آن را غیرفعال کنید.", 409);
  await prisma.foodSchedule.delete({ where: { id } });
  return ok({ deleted: true });
});
