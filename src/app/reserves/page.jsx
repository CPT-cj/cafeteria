import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUpcomingSchedules, groupByDay } from "@/services/menu";
import { PageTitle } from "@/components/ui/card";
import { ReserveBoard } from "@/components/reserves/ReserveBoard";
import { formatToman, todayUTC } from "@/lib/utils";

export const metadata = { title: "رزرو غذا" };

export default async function ReservesPage() {
  const user = await requireUser().catch(() => null);
  if (!user) return null;
  const [schedules, wallet, active] = await Promise.all([
    getUpcomingSchedules(user.id),
    prisma.wallet.findUnique({ where: { userId: user.id } }),
    prisma.reservation.findMany({
      where: { userId: user.id, status: "ACTIVE", schedule: { date: { gte: todayUTC() } } },
      include: { schedule: { include: { food: true } } },
      orderBy: [{ schedule: { date: "asc" } }, { schedule: { meal: "asc" } }],
    }),
  ]);
  const mine = active.map((r) => ({ id: r.id, foodName: r.schedule.food.name, date: r.schedule.date, meal: r.schedule.meal, price: r.price, reserveDeadline: r.schedule.reserveDeadline }));

  return (
    <>
      <PageTitle title="رزرو غذا" subtitle={`موجودی اعتبار شما: ${formatToman(wallet?.balance ?? 0)}`} />
      <ReserveBoard days={groupByDay(schedules)} mine={mine} />
    </>
  );
}
