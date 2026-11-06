import { randomUUID, randomInt } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/api";
import { formatToman } from "@/lib/utils";

export const TOPUP_MIN = 10_000;
export const TOPUP_MAX = 5_000_000;

export async function createTopupPayment(userId, amount) {
  const payment = await prisma.payment.create({ data: { userId, amount, authority: randomUUID() } });
  return { authority: payment.authority, redirectUrl: `/wallet/gateway/${payment.authority}` };
}

/**
 * تأیید پرداخت. در حالت آزمایشی (PAYMENT_MODE=mock) نتیجه را کاربر در صفحه درگاه آزمایشی تعیین می‌کند.
 * برای درگاه واقعی باید این تابع نتیجه را از سرور درگاه (verify سمت سرور) بگیرد، نه از مرورگر.
 */
export async function settlePayment(userId, authority, success) {
  if (process.env.PAYMENT_MODE !== "mock") throw new AppError("درگاه پرداخت واقعی هنوز پیکربندی نشده است.", 501);

  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({ where: { authority } });
    if (!payment || payment.userId !== userId) throw new AppError("پرداخت موردنظر پیدا نشد.", 404);

    // فقط یک درخواست می‌تواند پرداخت «در انتظار» را نهایی کند
    const claimed = await tx.payment.updateMany({
      where: { id: payment.id, status: "PENDING" },
      data: { status: success ? "SUCCESS" : "FAILED", verifiedAt: new Date(), refId: success ? String(randomInt(100000000, 999999999)) : null },
    });
    if (claimed.count === 0) throw new AppError("این پرداخت قبلاً نهایی شده است.", 409);

    if (!success) {
      const wallet = await tx.wallet.findUnique({ where: { userId } });
      await tx.transaction.create({
        data: { userId, type: "TOPUP", amount: payment.amount, status: "FAILED", balanceAfter: wallet.balance, description: "افزایش اعتبار (پرداخت ناموفق یا انصراف)", paymentId: payment.id },
      });
      return { status: "FAILED" };
    }

    const wallet = await tx.wallet.update({ where: { userId }, data: { balance: { increment: payment.amount } } });
    await tx.transaction.create({
      data: { userId, type: "TOPUP", amount: payment.amount, status: "SUCCESS", balanceAfter: wallet.balance, description: `افزایش اعتبار به مبلغ ${formatToman(payment.amount)}`, paymentId: payment.id },
    });
    return { status: "SUCCESS", balance: wallet.balance };
  });
}
