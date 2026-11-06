import { prisma } from "@/lib/prisma";
import { todayUTC } from "@/lib/utils";

export async function getDashboard(userId) {
  const [wallet, activeCount, next, transactions, reservations, announcements] = await Promise.all([
    prisma.wallet.findUnique({ where: { userId } }),
    prisma.reservation.count({ where: { userId, status: "ACTIVE", schedule: { date: { gte: todayUTC() } } } }),
    prisma.reservation.findMany({
      where: { userId, status: "ACTIVE", schedule: { date: { gte: todayUTC() } } },
      include: { schedule: { include: { food: true } } },
      orderBy: [{ schedule: { date: "asc" } }, { schedule: { meal: "asc" } }],
      take: 1,
    }),
    prisma.transaction.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.reservation.findMany({ where: { userId }, include: { schedule: { include: { food: true } } }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.announcement.findMany({ orderBy: { createdAt: "desc" }, take: 4 }),
  ]);
  return { balance: wallet?.balance ?? 0, activeCount, next: next[0] ?? null, transactions, reservations, announcements };
}
