import { AppError } from "@/lib/api";
import { bool, dayString, int, optStr, str, timeString, tehranInstant } from "@/lib/validate";

export function parseFood(b) {
  return {
    name: str(b.name, "نام غذا", { max: 80 }),
    category: str(b.category, "دسته‌بندی", { max: 40 }),
    price: int(b.price, "قیمت", { min: 0, max: 10_000_000 }),
    description: optStr(b.description, "توضیحات", 500),
    ingredients: optStr(b.ingredients, "مواد تشکیل‌دهنده", 500),
    imageUrl: optStr(b.imageUrl, "نشانی تصویر", 500),
    isActive: b.isActive === undefined ? true : bool(b.isActive, "وضعیت"),
  };
}

export function parseScheduleCreate(b) {
  const day = dayString(b.date, "تاریخ");
  const meal = b.meal === "LUNCH" || b.meal === "DINNER" ? b.meal : (() => { throw new AppError("«وعده» نامعتبر است."); })();
  const time = timeString(b.deadlineTime, "ساعت پایان مهلت");
  return {
    foodId: str(b.foodId, "غذا", { max: 60 }),
    date: day.date,
    meal,
    capacity: int(b.capacity, "ظرفیت", { min: 1, max: 100_000 }),
    price: int(b.price, "قیمت", { min: 0, max: 10_000_000 }),
    reserveDeadline: tehranInstant(day.text, time),
  };
}

export const dayText = (date) => date.toISOString().slice(0, 10);
