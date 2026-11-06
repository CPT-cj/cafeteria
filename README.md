



# راهنمای نصب و اجرای پروژه

## ۱. پیش‌نیازها

- [Node.js](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

Docker Desktop را نصب و اجرا کنید.

## ۲. آماده‌سازی پروژه

فایل ZIP را استخراج کنید و ترمینال را در پوشه اصلی پروژه (محل قرارگیری `package.json`) باز کنید.

## ۳. تنظیم متغیرهای محیطی

فایل `.env.example` را کپی کرده و نام نسخه کپی‌شده را به `.env` تغییر دهید.

محتوای فایل:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/self_service?schema=public"

AUTH_SECRET="YOUR_GENERATED_SECRET"

PAYMENT_MODE="mock"

SEED_ADMIN_PASSWORD="admin1234"
```

**ساخت کلید امنیتی (AUTH_SECRET):*<img width="1905" height="902" alt="Screenshot 2026-11-05 185613" src="https://github.com/user-attachments/assets/67d22449-5e07-47e2-be1d-5a3d3ee829fd" />


*

دستور زیر را در ترمینال اجرا کنید:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

رشته تولیدشده را کپی کرده و جایگزین `YOUR_GENERATED_SECRET` کنید.

در صورت تمایل، رمز مدیر اولیه را نیز از طریق `SEED_ADMIN_PASSWORD` تغییر دهید.

## ۴. اجرای دیتابیس

Docker Desktop را اجرا کرده و دستور زیر را در ترمینال پروژه وارد کنید:

```bash
docker compose up -d
```

## ۵. نصب وابستگی‌ها

```bash
npm install
```

## ۶. ساخت جداول دیتابیس

```bash
npx prisma migrate deploy
```

## ۷. ایجاد اطلاعات اولیه

```bash
npm run db:seed
```

## ۸. اجرای پروژه

```bash
npm run dev
```

سپس سایت را در آدرس زیر باز کنید:

http://localhost:3000

---

## نکات

- برای اجرای پروژه، Docker Desktop باید فعال باشد.
- فایل `.env` حاوی اطلاعات محرمانه است و نباید منتشر شود.
- پرداخت‌ها در حالت `mock` آزمایشی هستند و به درگاه واقعی متصل نیستند.
- در اجرای مجدد پروژه، نیازی به نصب دوباره وابستگی‌ها یا اجرای مجدد Migration و Seed نیست؛ کافی است دیتابیس را با `docker compose up -d` اجرا کرده و سپس `npm run dev` را بزنید.
