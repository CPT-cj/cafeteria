import { handle, ok, readJson } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { str } from "@/lib/validate";
import { reserveMeal } from "@/services/reservations";

export const POST = handle(async (req) => {
  const user = await requireUser();
  const { scheduleId } = await readJson(req);
  const reservation = await reserveMeal(user.id, str(scheduleId, "وعده", { max: 60 }));
  return ok({ reservation }, 201);
});
