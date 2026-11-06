import { prisma } from "@/lib/prisma";
import { handle, ok, readJson, AppError } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { parseScheduleCreate } from "@/services/admin";
import { todayUTC } from "@/lib/utils";

export const GET = handle(async () => {
  await requireAdmin();
  const from = new Date(todayUTC().getTime() - 7 * 86400000);
  const schedules = await prisma.foodSchedule.findMany({
    where: { date: { gte: from } },
    include: { food: { select: { name: true } } },
    orderBy: [{ date: "asc" }, { meal: "asc" }],
  });
  return ok({ schedules });
});

export const POST = handle(async (req) => {
  await requireAdmin();
  const data = parseScheduleCreate(await readJson(req));
  const food = await prisma.food.findUnique({ where: { id: data.foodId } });
  if (!food) throw new AppError("غذای انتخاب‌شده پیدا نشد.", 404);
  try {
    return ok({ schedule: await prisma.foodSchedule.create({ data }) }, 201);
  } catch (e) {
    if (e.code === "P2002") throw new AppError("این غذا برای همین روز و وعده قبلاً ثبت شده است.", 409);
    throw e;
  }
});
