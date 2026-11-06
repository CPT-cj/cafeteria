"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { FoodConveyor } from "./FoodConveyor";
import { HERO_DISHES } from "./hero-dishes";

const LABELS = { add: "رزرو این غذا", close: "بستن", previous: "غذای قبلی", next: "غذای بعدی", pause: "توقف نوار" };

export function Hero() {
  const router = useRouter();
  return (
    <div className="overflow-hidden rounded-3xl border border-border">
      <FoodConveyor
        items={HERO_DISHES}
        eyebrow="سلف مرکزی · منوی نمونه"
        heading="غذای سلف، همیشه در حرکت؛ همین‌جا انتخاب کن."
        caption="نشانگر را روی بشقاب ببرید، نوار را بکشید و غذای موردعلاقه‌تان را انتخاب کنید."
        autoplay
        labels={LABELS}
        onAdd={() => router.push("/reserves")}
        action={
          <Link href="/menu" className="inline-flex rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-sm outline-none transition-[translate,box-shadow] hover:-translate-y-px hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none">
            مشاهده منوی کامل
          </Link>
        }
      />
    </div>
  );
}
