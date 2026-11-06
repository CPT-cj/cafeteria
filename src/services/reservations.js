import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/api";
import { MEAL_LABELS } from "@/lib/utils";

// قفل ردیف کیف پول، عملیات مالی هر کاربر را پشت‌سرهم (سریال) می‌کند و از رزرو هم‌زمان تکراری جلوگیری می‌کند.
const lockWallet = (tx, userId) => tx.$queryRaw`SELECT id FROM "Wallet" WHERE "userId" = ${userId} FOR UPDATE`;

export async function reserveMeal(userId, scheduleId) {
  return prisma.$transaction(async (tx) => {
    await lockWallet(tx, userId);

    const schedule = await tx.foodSchedule.findUnique({ where: { id: scheduleId }, include: { food: true } });
    if (!schedule || !schedule.isActive || !schedule.food.isActive) throw new AppError("این وعده در دسترس نیست.", 404);
    if (new Date() >= schedule.reserveDeadline) throw new AppError("مهلت رزرو این وعده به پایان رسیده است.");

    const dup = await tx.reservation.findFirst({
      where: { userId, status: "ACTIVE", schedule: { date: schedule.date, meal: schedule.meal } },
    });
    if (dup) throw new AppError(`برای این وعده ${MEAL_LABELS[schedule.meal]} قبلاً رزرو دارید.`, 409);

    // افزایش اتمیک شمارنده فقط در صورت وجود ظرفیت
    const seat = await tx.foodSchedule.updateMany({
      where: { id: scheduleId, reservedCount: { lt: schedule.capacity } },
      data: { reservedCount: { increment: 1 } },
    });
    if (seat.count === 0) throw new AppError("ظرفیت این وعده تکمیل شده است.", 409);

    // کسر اتمیک اعتبار فقط در صورت کافی بودن موجودی
    const price = schedule.price;
    const paid = await tx.wallet.updateMany({ where: { userId, balance: { gte: price } }, data: { balance: { decrement: price } } });
    if (paid.count === 0) throw new AppError("موجودی اعتبار شما برای این رزرو کافی نیست.", 402);
    const wallet = await tx.wallet.findUnique({ where: { userId } });

    const existing = await tx.reservation.findUnique({ where: { userId_scheduleId: { userId, scheduleId } } });
    const reservation = existing
      ? await tx.reservation.update({ where: { id: existing.id }, data: { status: "ACTIVE", price, canceledAt: null } })
      : await tx.reservation.create({ data: { userId, scheduleId, price } });

    await tx.transaction.create({
      data: {
        userId, type: "RESERVE", amount: price, status: "SUCCESS", balanceAfter: wallet.balance,
        description: `رزرو ${schedule.food.name} (${MEAL_LABELS[schedule.meal]})`, reservationId: reservation.id,
      },
    });
    return reservation;
  });
}

export async function cancelReservation(userId, reservationId) {
  return prisma.$transaction(async (tx) => {
    await lockWallet(tx, userId);

    const r = await tx.reservation.findUnique({ where: { id: reservationId }, include: { schedule: { include: { food: true } } } });
    if (!r || r.userId !== userId) throw new AppError("رزرو موردنظر پیدا نشد.", 404);
    if (r.status !== "ACTIVE") throw new AppError("این رزرو قبلاً لغو شده است.", 409);
    if (new Date() >= r.schedule.reserveDeadline) throw new AppError("مهلت لغو این رزرو به پایان رسیده است.");

    const changed = await tx.reservation.updateMany({
      where: { id: r.id, status: "ACTIVE" },
      data: { status: "CANCELED", canceledAt: new Date() },
    });
    if (changed.count === 0) throw new AppError("این رزرو قبلاً لغو شده است.", 409);

    await tx.foodSchedule.update({ where: { id: r.scheduleId }, data: { reservedCount: { decrement: 1 } } });
    const wallet = await tx.wallet.update({ where: { userId }, data: { balance: { increment: r.price } } });
    await tx.transaction.create({
      data: {
        userId, type: "REFUND", amount: r.price, status: "SUCCESS", balanceAfter: wallet.balance,
        description: `استرداد وجه لغو رزرو ${r.schedule.food.name} (${MEAL_LABELS[r.schedule.meal]})`, reservationId: r.id,
      },
    });
    return { refunded: r.price };
  });
}
