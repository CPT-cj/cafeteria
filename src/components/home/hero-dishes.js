import { formatToman } from "@/lib/utils";

// نمونه غذاهای Hero با تصاویر جایگزین (placeholder) در public/plates.
// برای تصویر واقعی، فایل‌های شفاف مربع (بالا-نمای بشقاب) را جایگزین کنید یا آدرس را عوض کنید.
const DISHES = [
  { id: "kebab", name: "چلوکباب کوبیده", price: 65000, tier: 5, description: "دو سیخ کباب کوبیده با برنج ایرانی، گوجه کبابی و کره.", details: ["۱ پرس", "گوشت قرمز", "برنج"] },
  { id: "ghormeh", name: "قرمه‌سبزی", price: 55000, tier: 3, description: "خورشت سنتی سبزی با گوشت و لوبیا قرمز.", details: ["۱ پرس", "گوشت قرمز", "برنج"] },
  { id: "gheimeh", name: "قیمه بادمجان", price: 50000, tier: 2, description: "خورشت قیمه با لپه، بادمجان و سیب‌زمینی سرخ‌شده.", details: ["۱ پرس", "گوشت قرمز", "برنج"] },
  { id: "zereshk", name: "زرشک‌پلو با مرغ", price: 60000, tier: 4, description: "زرشک‌پلو معطر با زعفران و ران مرغ.", details: ["۱ پرس", "مرغ", "برنج"] },
  { id: "tahchin", name: "ته‌چین مرغ", price: 58000, tier: 3, description: "ته‌چین مرغ با ماست و زعفران و پوسته طلایی.", details: ["۱ پرس", "مرغ", "برنج"] },
  { id: "adas", name: "عدس‌پلو", price: 30000, tier: 1, description: "عدس‌پلو با کشمش و پیاز داغ؛ سبک و گیاهی.", details: ["۱ پرس", "گیاهی", "برنج"] },
  { id: "kuku", name: "کوکو سبزی", price: 28000, tier: 1, description: "کوکو سبزی تازه با ماست و نان.", details: ["۱ پرس", "گیاهی", "تخم‌مرغ"] },
  { id: "fesenjan", name: "فسنجان", price: 62000, tier: 4, description: "خورشت فسنجان با مرغ، گردو و رب انار.", details: ["۱ پرس", "مرغ", "گردو"] },
];

export const HERO_DISHES = DISHES.map((d) => ({ ...d, price: formatToman(d.price), image: `/plates/${d.id}.svg` }));
