import { prisma } from "@/lib/prisma";
import { handle, ok, readJson, AppError } from "@/lib/api";
import { createSession, verifyPassword } from "@/lib/auth";
import { toEnglishDigits } from "@/lib/utils";

export const POST = handle(async (req) => {
  const b = await readJson(req);
  const studentNumber = toEnglishDigits(typeof b.studentNumber === "string" ? b.studentNumber.trim() : "");
  const password = typeof b.password === "string" ? b.password : "";
  const user = studentNumber ? await prisma.user.findUnique({ where: { studentNumber } }) : null;
  const valid = user && (await verifyPassword(password, user.passwordHash));
  if (!valid) throw new AppError("شماره دانشجویی یا رمز عبور اشتباه است.", 401);
  if (!user.isActive) throw new AppError("حساب کاربری شما غیرفعال شده است.", 403);
  await createSession(user);
  return ok({ ok: true });
});
