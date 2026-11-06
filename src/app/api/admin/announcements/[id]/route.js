import { prisma } from "@/lib/prisma";
import { handle, ok } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";

export const DELETE = handle(async (_req, ctx) => {
  await requireAdmin();
  const { id } = await ctx.params;
  await prisma.announcement.deleteMany({ where: { id } });
  return ok({ deleted: true });
});
