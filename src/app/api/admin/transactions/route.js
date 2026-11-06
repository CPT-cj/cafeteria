import { prisma } from "@/lib/prisma";
import { handle, ok } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";

export const GET = handle(async () => {
  await requireAdmin();
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: { select: { firstName: true, lastName: true, studentNumber: true } } },
  });
  return ok({ transactions });
});
