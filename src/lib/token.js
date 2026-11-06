// بخش سازگار با Edge (برای middleware) — بدون وابستگی به Prisma یا bcrypt
import { SignJWT, jwtVerify } from "jose";

export const COOKIE = "session";
export const MAX_AGE = 60 * 60 * 24 * 7;

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) throw new Error("متغیر AUTH_SECRET باید حداقل ۳۲ کاراکتر باشد.");
  return new TextEncoder().encode(s);
}

export function signToken(user) {
  return new SignJWT({ role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload;
  } catch {
    return null;
  }
}
