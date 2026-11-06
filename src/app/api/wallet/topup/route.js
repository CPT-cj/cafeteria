import { handle, ok, readJson, AppError } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { int } from "@/lib/validate";
import { createTopupPayment, TOPUP_MIN, TOPUP_MAX } from "@/services/wallet";
import { formatToman } from "@/lib/utils";

export const POST = handle(async (req) => {
  const user = await requireUser();
  const { amount } = await readJson(req);
  const value = int(amount, "مبلغ", { min: 0 });
  if (value < TOPUP_MIN || value > TOPUP_MAX) throw new AppError(`مبلغ باید بین ${formatToman(TOPUP_MIN)} و ${formatToman(TOPUP_MAX)} باشد.`);
  return ok(await createTopupPayment(user.id, value), 201);
});
