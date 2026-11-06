import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageTitle, Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { FoodImage } from "@/components/ui/food-image";
import { cn, formatToman, formatDay, MEAL_LABELS, todayUTC } from "@/lib/utils";

export const metadata = { title: "منوی غذا" };

export default async function MenuPage({ searchParams }) {
  const { category } = await searchParams;
  const categories = (await prisma.food.findMany({ where: { isActive: true }, distinct: ["category"], select: { category: true }, orderBy: { category: "asc" } })).map((c) => c.category);
  const foods = await prisma.food.findMany({
    where: { isActive: true, ...(category && categories.includes(category) ? { category } : {}) },
    orderBy: { name: "asc" },
    include: { schedules: { where: { isActive: true, date: { gte: todayUTC() } }, orderBy: [{ date: "asc" }, { meal: "asc" }], take: 3 } },
  });
  const chip = (active) => cn("rounded-full border px-4 py-1.5 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring", active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted");

  return (
    <>
      <PageTitle title="منوی غذا" subtitle="همه غذاهای موجود در سلف دانشگاه" />
      <nav aria-label="دسته‌بندی غذاها" className="mb-6 flex flex-wrap gap-2">
        <Link href="/menu" className={chip(!category)}>همه</Link>
        {categories.map((c) => <Link key={c} href={`/menu?category=${encodeURIComponent(c)}`} className={chip(category === c)}>{c}</Link>)}
      </nav>
      {foods.length === 0 ? <EmptyState title="غذایی پیدا نشد" /> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {foods.map((f) => (
            <Card key={f.id} className="flex flex-col gap-3">
              <div className="grid place-items-center rounded-xl bg-muted py-4"><FoodImage src={f.imageUrl} alt={f.name} className="size-32" /></div>
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold">{f.name}</h2>
                <Badge>{f.category}</Badge>
              </div>
              {f.description && <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>}
              {f.ingredients && <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground">مواد اولیه: </span>{f.ingredients}</p>}
              <p className="font-bold">{formatToman(f.price)}</p>
              <div className="mt-auto border-t border-border pt-3">
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">وعده‌های پیش‌رو</p>
                {f.schedules.length === 0 ? <p className="text-xs text-muted-foreground">فعلاً در برنامه نیست.</p> : (
                  <div className="flex flex-wrap gap-1.5">{f.schedules.map((s) => <Badge key={s.id} tone="info">{formatDay(s.date)} · {MEAL_LABELS[s.meal]}</Badge>)}</div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
