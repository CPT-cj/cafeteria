import { handle, ok } from "@/lib/api";
import { requireUser } from "@/lib/auth";

export const GET = handle(async () => ok({ user: await requireUser() }));
