"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/client";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { FoodImage } from "@/components/ui/food-image";
import { formatToman, formatDay, formatWeekday, formatDateTime, formatNumber, MEAL_LABELS } from "@/lib/utils";

export function ReserveBoard({ days, mine }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState(null);
  const [msg, setMsg] = useState(null);
  const now = Date.now();

  async function run(id, request, okText) {
    setBusyId(id);
    setMsg(null);
    const res = await request();
    setMsg(res.ok ? { tone: "success", text: okText } : { tone: "error", text: res.error });
    setBusyId(null);
    if (res.ok) router.refresh();
  }
  const reserve = (s) => run(s.id, () => api("/api/reservations", { method: "POST", body: { scheduleId: s.id } }), `«${s.foodName}» با موفقیت رزرو شد و مبلغ از اعتبار شما کسر گردید.`);
  const cancel = (id, name) => run(id, () => api(`/api/reservations/${id}`, { method: "DELETE" }), `رزرو «${name}» لغو شد و مبلغ به اعتبار شما بازگشت.`);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div className="flex flex-col gap-8">
        {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
        {days.length === 0 && <EmptyState title="برنامه غذایی ثبت نشده است" description="هنوز برنامه‌ای برای روزهای آینده منتشر نشده است." />}
        {days.map((day) => (
          <section key={String(day.date)} aria-label={formatDay(day.date)}>
            <h2 className="mb-3 text-lg font-bold">{formatWeekday(day.date)} <span className="font-normal text-muted-foreground">{formatDay(day.date)}</span></h2>
            <div className="flex flex-col gap-5">
              {["LUNCH", "DINNER"].map((meal) => {
                const options = day.meals[meal];
                if (!options.length) return null;
                const hasMine = options.some((o) => o.reservationId);
                return (
                  <div key={meal}>
                    <h3 className="mb-2 text-sm font-semibold text-muted-foreground">{MEAL_LABELS[meal]}</h3>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {options.map((o) => {
                        const left = o.capacity - o.reservedCount;
                        const closed = new Date(o.reserveDeadline).getTime() <= now;
                        const reserved = !!o.reservationId;
                        return (
                          <Card key={o.id} className="flex flex-col gap-3 p-4">
                            <div className="flex items-center gap-3">
                              <FoodImage src={o.imageUrl} alt={o.foodName} className="size-16 shrink-0" />
                              <div className="min-w-0">
                                <p className="font-semibold">{o.foodName}</p>
                                <p className="text-sm text-muted-foreground">{formatToman(o.price)}</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <Badge tone={left <= 0 ? "danger" : left < 10 ? "warning" : "neutral"}>{left <= 0 ? "ظرفیت تکمیل" : `${formatNumber(left)} ظرفیت باقی‌مانده`}</Badge>
                              <span className="text-muted-foreground">مهلت: {formatDateTime(o.reserveDeadline)}</span>
                            </div>
                            {reserved ? (
                              <Button variant="outline" disabled={closed || busyId === o.reservationId} onClick={() => cancel(o.reservationId, o.foodName)}>
                                {closed ? "رزرو شده (مهلت لغو گذشته)" : busyId === o.reservationId ? "در حال لغو…" : "لغو رزرو"}
                              </Button>
                            ) : (
                              <Button disabled={closed || left <= 0 || hasMine || busyId === o.id} onClick={() => reserve(o)}>
                                {closed ? "مهلت رزرو تمام شده" : left <= 0 ? "ظرفیت تکمیل" : hasMine ? "برای این وعده رزرو دارید" : busyId === o.id ? "در حال ثبت…" : "رزرو"}
                              </Button>
                            )}
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <aside aria-label="رزروهای فعال من" className="lg:sticky lg:top-6 lg:self-start">
        <Card>
          <h2 className="mb-3 font-semibold">رزروهای فعال من</h2>
          {mine.length === 0 ? <p className="text-sm text-muted-foreground">رزرو فعالی ندارید.</p> : (
            <ul className="divide-y divide-border">
              {mine.map((r) => {
                const closed = new Date(r.reserveDeadline).getTime() <= now;
                return (
                  <li key={r.id} className="flex items-center justify-between gap-2 py-3 text-sm">
                    <div>
                      <p className="font-medium">{r.foodName}</p>
                      <p className="text-xs text-muted-foreground">{formatDay(r.date)} · {MEAL_LABELS[r.meal]} · {formatToman(r.price)}</p>
                    </div>
                    <Button size="sm" variant="ghost" disabled={closed || busyId === r.id} onClick={() => cancel(r.id, r.foodName)}>لغو</Button>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </aside>
    </div>
  );
}
