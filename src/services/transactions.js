import { prisma } from "@/lib/prisma";

export const PAGE_SIZE = 10;
const TYPES = ["TOPUP", "RESERVE", "REFUND"];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function listTransactions(userId, { type, from, to, page = 1 } = {}) {
  const where = { userId };
  if (TYPES.includes(type)) where.type = type;
  const createdAt = {};
  if (from && DATE_RE.test(from)) createdAt.gte = new Date(`${from}T00:00:00+03:30`);
  if (to && DATE_RE.test(to)) createdAt.lte = new Date(`${to}T23:59:59.999+03:30`);
  if (Object.keys(createdAt).length) where.createdAt = createdAt;

  const p = Math.max(1, Number.parseInt(page, 10) || 1);
  const [total, items] = await Promise.all([
    prisma.transaction.count({ where }),
    prisma.transaction.findMany({ where, orderBy: { createdAt: "desc" }, skip: (p - 1) * PAGE_SIZE, take: PAGE_SIZE }),
  ]);
  return { items, total, page: p, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}
