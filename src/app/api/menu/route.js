import { handle, ok } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { getUpcomingSchedules, groupByDay } from "@/services/menu";

export const GET = handle(async () => {
  const user = await getCurrentUser();
  return ok({ days: groupByDay(await getUpcomingSchedules(user?.id)) });
});
