import { prisma } from "@/lib/prisma";
import { todayUTC } from "@/lib/utils";

/** برنامه غذایی روزهای آینده + رزروهای فعال کاربر (در صورت ورود) */
export async function getUpcomingSchedules(userId) {
  const schedules = await prisma.foodSchedule.findMany({
    where: { isActive: true, date: { gte: todayUTC() }, food: { isActive: true } },
    include: { food: true },
    orderBy: [{ date: "asc" }, { meal: "asc" }, { food: { name: "asc" } }],
  });
  const mine = userId
    ? await prisma.reservation.findMany({ where: { userId, status: "ACTIVE", scheduleId: { in: schedules.map((s) => s.id) } }, select: { id: true, scheduleId: true } })
    : [];
  const byId = new Map(mine.map((r) => [r.scheduleId, r.id]));
  return schedules.map((s) => ({ ...s, reservationId: byId.get(s.id) ?? null }));
}

/** گروه‌بندی به‌شکل روز ← وعده ← گزینه‌ها */
export function groupByDay(schedules) {
  const days = new Map();
  for (const s of schedules) {
    const key = s.date.toISOString();
    if (!days.has(key)) days.set(key, { date: s.date, meals: { LUNCH: [], DINNER: [] } });
    days.get(key).meals[s.meal].push({
      id: s.id, foodName: s.food.name, imageUrl: s.food.imageUrl, description: s.food.description,
      price: s.price, capacity: s.capacity, reservedCount: s.reservedCount,
      reserveDeadline: s.reserveDeadline, reservationId: s.reservationId,
    });
  }
  return [...days.values()];
}
