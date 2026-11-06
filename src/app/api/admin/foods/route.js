import { prisma } from "@/lib/prisma";
import { handle, ok, readJson } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { parseFood } from "@/services/admin";

export const GET = handle(async () => {
  await requireAdmin();
  return ok({ foods: await prisma.food.findMany({ orderBy: { createdAt: "desc" } }) });
});

export const POST = handle(async (req) => {
  await requireAdmin();
  const food = await prisma.food.create({ data: parseFood(await readJson(req)) });
  return ok({ food }, 201);
});
