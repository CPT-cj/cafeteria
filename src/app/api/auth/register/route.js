import { prisma } from "@/lib/prisma";
import { handle, ok, readJson, AppError } from "@/lib/api";
import { createSession, hashPassword } from "@/lib/auth";
import { str } from "@/lib/validate";
import { toEnglishDigits } from "@/lib/utils";

export const POST = handle(async (req) => {
  const b = await readJson(req);
  const studentNumber = toEnglishDigits(str(b.studentNumber, "شماره دانشجویی", { max: 20 }));
  if (!/^\d{5,12}$/.test(studentNumber)) throw new AppError("شماره دانشجویی باید بین ۵ تا ۱۲ رقم باشد.");
  const firstName = str(b.firstName, "نام", { min: 2, max: 50 });
  const lastName = str(b.lastName, "نام خانوادگی", { min: 2, max: 50 });
  const phone = toEnglishDigits(str(b.phone, "شماره موبایل", { max: 20 }));
  if (!/^09\d{9}$/.test(phone)) throw new AppError("شماره موبایل باید به‌صورت ۰۹۱۲۳۴۵۶۷۸۹ باشد.");
  const password = typeof b.password === "string" ? b.password : "";
  if (password.length < 8 || password.length > 72) throw new AppError("رمز عبور باید بین ۸ تا ۷۲ کاراکتر باشد.");

  let user;
  try {
    user = await prisma.user.create({
      data: { studentNumber, firstName, lastName, phone, passwordHash: await hashPassword(password), role: "STUDENT", wallet: { create: {} } },
    });
  } catch (e) {
    if (e.code === "P2002") throw new AppError("این شماره دانشجویی قبلاً ثبت‌نام کرده است.", 409);
    throw e;
  }
  await createSession(user);
  return ok({ ok: true }, 201);
});
