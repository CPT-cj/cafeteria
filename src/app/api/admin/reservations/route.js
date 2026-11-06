import { prisma } from "@/lib/prisma";
import { handle, ok } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";

export const GET = handle(async () => {
  await requireAdmin();
  const reservations = await prisma.reservation.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user: { select: { firstName: true, lastName: true, studentNumber: true } },
      schedule: { select: { date: true, meal: true, food: { select: { name: true } } } },
    },
  });
  return ok({ reservations });
});
