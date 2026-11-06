import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge, statusTone } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatToman, formatDay, formatWeekday, formatDateTime, MEAL_LABELS, TX_TYPE_LABELS, TX_STATUS_LABELS, RESERVATION_STATUS_LABELS, formatNumber } from "@/lib/utils";

const QUICK = [
  { href: "/reserves", label: "رزرو غذا", hint: "برنامه روزهای آینده" },
  { href: "/wallet", label: "افزایش اعتبار", hint: "شارژ کیف پول" },
  { href: "/transactions", label: "تراکنش‌ها", hint: "سوابق مالی" },
  { href: "/menu", label: "منوی غذا", hint: "همه غذاها" },
];

function Stat({ label, value, href, sub }) {
  const body = (
    <Card className="h-full transition-colors hover:bg-muted/50">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-xl font-bold">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </Card>
  );
  return href ? <Link href={href} className="block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl">{body}</Link> : body;
}

export function Dashboard({ user, data }) {
  const { balance, activeCount, next, transactions, reservations, announcements } = data;
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold">سلام {user.firstName} 👋</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="موجودی اعتبار" value={formatToman(balance)} href="/wallet" />
        <Stat label="رزروهای فعال" value={formatNumber(activeCount)} href="/reserves" />
        <Stat
          label="نزدیک‌ترین وعده رزروشده"
          value={next ? next.schedule.food.name : "رزروی ندارید"}
          sub={next ? `${formatWeekday(next.schedule.date)} ${formatDay(next.schedule.date)} · ${MEAL_LABELS[next.schedule.meal]}` : "از بخش رزرو، غذای خود را انتخاب کنید."}
          href="/reserves"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK.map((q) => (
          <Link key={q.href} href={q.href} className="rounded-2xl border border-border bg-card p-4 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">
            <p className="font-medium">{q.label}</p>
            <p className="text-xs text-muted-foreground">{q.hint}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="آخرین تراکنش‌ها" action={<Link href="/transactions" className="text-xs text-primary hover:underline">همه</Link>} />
          {transactions.length === 0 ? <EmptyState title="هنوز تراکنشی ندارید" /> : (
            <ul className="divide-y divide-border">
              {transactions.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div><p className="font-medium">{TX_TYPE_LABELS[t.type]}</p><p className="text-xs text-muted-foreground">{formatDateTime(t.createdAt)}</p></div>
                  <div className="text-end"><p className={t.type === "RESERVE" ? "text-danger" : "text-success"}>{t.type === "RESERVE" ? "−" : "+"}{formatToman(t.amount)}</p><Badge tone={statusTone[t.status]}>{TX_STATUS_LABELS[t.status]}</Badge></div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader title="وضعیت رزروهای اخیر" action={<Link href="/reserves" className="text-xs text-primary hover:underline">رزرو جدید</Link>} />
          {reservations.length === 0 ? <EmptyState title="هنوز رزروی ثبت نکرده‌اید" /> : (
            <ul className="divide-y divide-border">
              {reservations.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div><p className="font-medium">{r.schedule.food.name}</p><p className="text-xs text-muted-foreground">{formatDay(r.schedule.date)} · {MEAL_LABELS[r.schedule.meal]}</p></div>
                  <Badge tone={statusTone[r.status]}>{RESERVATION_STATUS_LABELS[r.status]}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card>
        <CardHeader title="اطلاعیه‌های دانشگاه" />
        {announcements.length === 0 ? <EmptyState title="اطلاعیه‌ای وجود ندارد" /> : (
          <ul className="grid gap-4 md:grid-cols-2">
            {announcements.map((a) => (
              <li key={a.id} className="rounded-xl bg-muted p-4">
                <p className="font-medium">{a.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
                <p className="mt-2 text-xs text-muted-foreground">{formatDateTime(a.createdAt)}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
