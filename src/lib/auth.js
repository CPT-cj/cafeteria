import { cache } from "react";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { AppError } from "./api";
import { COOKIE, MAX_AGE, signToken, verifyToken } from "./token";

export const hashPassword = (p) => bcrypt.hash(p, 12);
export const verifyPassword = (p, hash) => bcrypt.compare(p, hash);

export async function createSession(user) {
  const token = await signToken(user);
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

/** کاربر فعلی را همیشه از دیتابیس می‌خواند تا نقش و وضعیت فعال بودن به‌روز باشد. */
export const getCurrentUser = cache(async () => {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload?.sub) return null;
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, studentNumber: true, firstName: true, lastName: true, phone: true, role: true, isActive: true },
  });
  return user && user.isActive ? user : null;
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new AppError("برای ادامه ابتدا وارد حساب کاربری شوید.", 401);
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new AppError("دسترسی به این بخش مجاز نیست.", 403);
  return user;
}
