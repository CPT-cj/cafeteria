import { handle, ok, readJson } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { bool, str } from "@/lib/validate";
import { settlePayment } from "@/services/wallet";

export const POST = handle(async (req) => {
  const user = await requireUser();
  const b = await readJson(req);
  return ok(await settlePayment(user.id, str(b.authority, "شناسه پرداخت", { max: 80 }), bool(b.success, "نتیجه پرداخت")));
});
