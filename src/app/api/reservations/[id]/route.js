import { handle, ok } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { cancelReservation } from "@/services/reservations";

export const DELETE = handle(async (_req, ctx) => {
  const user = await requireUser();
  const { id } = await ctx.params;
  return ok(await cancelReservation(user.id, id));
});
