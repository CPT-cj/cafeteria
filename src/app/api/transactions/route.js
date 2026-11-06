import { handle, ok } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { listTransactions } from "@/services/transactions";

export const GET = handle(async (req) => {
  const user = await requireUser();
  const q = Object.fromEntries(new URL(req.url).searchParams);
  return ok(await listTransactions(user.id, q));
});
