import { AppError } from "./api";
import { toEnglishDigits } from "./utils";

export function str(v, label, { min = 1, max = 200 } = {}) {
  const s = typeof v === "string" ? v.trim() : "";
  if (s.length < min || s.length > max) throw new AppError(`«${label}» نامعتبر است.`);
  return s;
}

export function optStr(v, label, max = 1000) {
  if (v === undefined || v === null || v === "") return null;
  return str(v, label, { min: 1, max });
}

export function int(v, label, { min = 0, max = 1_000_000_000 } = {}) {
  const n = Number(toEnglishDigits(v));
  if (!Number.isInteger(n) || n < min || n > max) throw new AppError(`«${label}» نامعتبر است.`);
  return n;
}

export function oneOf(v, list, label) {
  if (!list.includes(v)) throw new AppError(`«${label}» نامعتبر است.`);
  return v;
}

export function bool(v, label) {
  if (typeof v !== "boolean") throw new AppError(`«${label}» نامعتبر است.`);
  return v;
}

/** تاریخ به‌شکل YYYY-MM-DD → نیمه‌شب UTC */
export function dayString(v, label) {
  const s = toEnglishDigits(v);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s) || Number.isNaN(Date.parse(`${s}T00:00:00Z`))) throw new AppError(`«${label}» نامعتبر است.`);
  return { text: s, date: new Date(`${s}T00:00:00Z`) };
}

export function timeString(v, label) {
  const s = toEnglishDigits(v);
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(s)) throw new AppError(`«${label}» نامعتبر است.`);
  return s;
}

/** ساعت محلی تهران (UTC+03:30) برای یک روز مشخص */
export const tehranInstant = (dayText, time) => new Date(`${dayText}T${time}:00+03:30`);
