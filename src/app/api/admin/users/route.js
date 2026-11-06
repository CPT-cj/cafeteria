import { prisma } from "@/lib/prisma";
import { handle, ok } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";

export const GET = handle(async () => {
  await requireAdmin();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    select: { id: true, studentNumber: true, firstName: true, lastName: true, phone: true, role: true, isActive: true, wallet: { select: { balance: true } } },
  });
  return ok({ users });
});
