const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const FOODS = [
  { name: "چلوکباب کوبیده", category: "غذای اصلی", price: 65000, plate: "kebab", description: "دو سیخ کباب کوبیده همراه با برنج ایرانی، گوجه کبابی و کره.", ingredients: "گوشت چرخ‌کرده، پیاز، برنج، گوجه" },
  { name: "قرمه‌سبزی", category: "خورشت", price: 55000, plate: "ghormeh", description: "خورشت سنتی سبزی با گوشت و لوبیا قرمز، همراه با برنج.", ingredients: "سبزی قرمه، گوشت، لوبیا قرمز، لیمو عمانی" },
  { name: "قیمه بادمجان", category: "خورشت", price: 50000, plate: "gheimeh", description: "خورشت قیمه با لپه و سیب‌زمینی سرخ‌شده و بادمجان.", ingredients: "گوشت، لپه، بادمجان، سیب‌زمینی، رب گوجه" },
  { name: "زرشک‌پلو با مرغ", category: "غذای اصلی", price: 60000, plate: "zereshk", description: "زرشک‌پلو با زعفران و ران مرغ پخته‌شده.", ingredients: "مرغ، برنج، زرشک، زعفران" },
  { name: "ته‌چین مرغ", category: "غذای اصلی", price: 58000, plate: "tahchin", description: "ته‌چین مرغ با ماست و زعفران و پوسته طلایی.", ingredients: "مرغ، برنج، ماست، زعفران، تخم‌مرغ" },
  { name: "عدس‌پلو", category: "غذای سبک", price: 30000, plate: "adas", description: "عدس‌پلو با کشمش و پیاز داغ؛ گزینه‌ای سبک و گیاهی.", ingredients: "عدس، برنج، کشمش، پیاز داغ" },
  { name: "کوکو سبزی", category: "غذای سبک", price: 28000, plate: "kuku", description: "کوکو سبزی تازه با ماست و نان.", ingredients: "سبزی کوکو، تخم‌مرغ، گردو، زرشک" },
  { name: "فسنجان", category: "خورشت", price: 62000, plate: "fesenjan", description: "خورشت فسنجان با مرغ، گردو و رب انار.", ingredients: "مرغ، گردوی آسیاب‌شده، رب انار" },
];

const DAY = 86400000;

async function main() {
  const adminPass = process.env.SEED_ADMIN_PASSWORD || "admin1234";

  await prisma.user.upsert({
    where: { studentNumber: "admin" },
    update: {},
    create: { studentNumber: "admin", firstName: "مدیر", lastName: "سامانه", phone: "09120000000", passwordHash: await bcrypt.hash(adminPass, 12), role: "ADMIN", wallet: { create: { balance: 0 } } },
  });
  await prisma.user.upsert({
    where: { studentNumber: "40012345" },
    update: {},
    create: { studentNumber: "40012345", firstName: "سارا", lastName: "احمدی", phone: "09121234567", passwordHash: await bcrypt.hash("student123", 12), wallet: { create: { balance: 300000 } } },
  });

  if ((await prisma.food.count()) === 0) {
    const foods = [];
    for (const f of FOODS) {
      const { plate, ...rest } = f;
      foods.push(await prisma.food.create({ data: { ...rest, imageUrl: `/plates/${plate}.svg` } }));
    }

    // نیمه‌شب UTC امروز (به وقت تهران)
    const t = new Date(Date.now() + 3.5 * 3600 * 1000);
    const today = Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate());

    for (let d = 1; d <= 7; d++) {
      const date = new Date(today + d * DAY);
      // مهلت رزرو: ناهار ساعت ۸ و شام ساعت ۱۵ به وقت تهران (UTC+3:30)
      const lunchDeadline = new Date(date.getTime() + (8 - 3.5) * 3600 * 1000);
      const dinnerDeadline = new Date(date.getTime() + (15 - 3.5) * 3600 * 1000);
      const lunch = [0, 1, 5].map((i) => foods[(i + d) % foods.length]);
      const dinner = [2, 6].map((i) => foods[(i + d) % foods.length]);
      for (const f of lunch) await prisma.foodSchedule.create({ data: { foodId: f.id, date, meal: "LUNCH", capacity: 120, price: f.price, reserveDeadline: lunchDeadline } });
      for (const f of dinner) await prisma.foodSchedule.create({ data: { foodId: f.id, date, meal: "DINNER", capacity: 60, price: f.price, reserveDeadline: dinnerDeadline } });
    }
  }

  if ((await prisma.announcement.count()) === 0) {
    await prisma.announcement.createMany({
      data: [
        { title: "شروع رزرو هفته آینده", body: "رزرو غذای هفته آینده تا ساعت ۸ صبح هر روز برای ناهار و ۱۵ برای شام امکان‌پذیر است." },
        { title: "افزایش اعتبار", body: "درگاه پرداخت در این نسخه آزمایشی است و وجه واقعی کسر نمی‌شود." },
      ],
    });
  }
  console.log("Seed انجام شد. مدیر: admin | دانشجو: 40012345 / student123");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
