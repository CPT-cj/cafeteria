export const cn = (...c) => c.filter(Boolean).join(" ");

const EN = "0123456789";
export function toEnglishDigits(v) {
  return String(v ?? "")
    .replace(/[۰-۹]/g, (d) => EN["۰۱۲۳۴۵۶۷۸۹".indexOf(d)])
    .replace(/[٠-٩]/g, (d) => EN["٠١٢٣٤٥٦٧٨٩".indexOf(d)]);
}

export const formatNumber = (n) => Number(n).toLocaleString("fa-IR");
export const formatToman = (n) => `${formatNumber(n)} تومان`;

// تاریخ‌های «روز» (برنامه غذایی) به‌صورت نیمه‌شب UTC ذخیره می‌شوند؛ زمان‌های دقیق به وقت تهران نمایش داده می‌شوند.
const TZ = "Asia/Tehran";
const dayFmt = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
const weekdayFmt = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { weekday: "long", timeZone: "UTC" });
const dateTimeFmt = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: TZ });
const timeFmt = new Intl.DateTimeFormat("fa-IR", { hour: "2-digit", minute: "2-digit", timeZone: TZ });

export const formatDay = (d) => dayFmt.format(new Date(d));
export const formatWeekday = (d) => weekdayFmt.format(new Date(d));
export const formatDateTime = (d) => dateTimeFmt.format(new Date(d));
export const formatTime = (d) => timeFmt.format(new Date(d));

/** امروز (به وقت تهران) به‌صورت نیمه‌شب UTC */
export function todayUTC() {
  const t = new Date(Date.now() + 3.5 * 3600 * 1000);
  return new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()));
}

export const MEAL_LABELS = { LUNCH: "ناهار", DINNER: "شام" };
export const TX_TYPE_LABELS = { TOPUP: "افزایش اعتبار", RESERVE: "رزرو غذا", REFUND: "استرداد وجه" };
export const TX_STATUS_LABELS = { SUCCESS: "موفق", PENDING: "در انتظار", FAILED: "ناموفق" };
export const RESERVATION_STATUS_LABELS = { ACTIVE: "فعال", CANCELED: "لغو شده" };
export const ROLE_LABELS = { STUDENT: "دانشجو", ADMIN: "مدیر" };
