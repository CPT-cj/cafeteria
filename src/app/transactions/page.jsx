import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { listTransactions } from "@/services/transactions";
import { PageTitle, Card } from "@/components/ui/card";
import { Badge, statusTone } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, Input, Select } from "@/components/ui/field";
import { Button, buttonClass } from "@/components/ui/button";
import { formatToman, formatDateTime, formatNumber, TX_TYPE_LABELS, TX_STATUS_LABELS } from "@/lib/utils";

export const metadata = { title: "تراکنش‌ها" };

export default async function TransactionsPage({ searchParams }) {
  const user = await requireUser().catch(() => null);
  if (!user) return null; // middleware ورود را اجباری می‌کند
  const sp = await searchParams;
  const q = { type: sp.type, from: sp.from, to: sp.to, page: sp.page };
  const { items, total, page, pages } = await listTransactions(user.id, q);

  const href = (p) => {
    const params = new URLSearchParams();
    for (const k of ["type", "from", "to"]) if (sp[k]) params.set(k, sp[k]);
    params.set("page", String(p));
    return `/transactions?${params}`;
  };

  return (
    <>
      <PageTitle title="تراکنش‌ها" subtitle={`${formatNumber(total)} تراکنش یافت شد.`} />
      <Card className="mb-6">
        <form className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
          <Field label="نوع تراکنش">
            <Select name="type" defaultValue={sp.type ?? ""}>
              <option value="">همه</option>
              {Object.entries(TX_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </Select>
          </Field>
          <Field label="از تاریخ"><Input type="date" name="from" defaultValue={sp.from ?? ""} /></Field>
          <Field label="تا تاریخ"><Input type="date" name="to" defaultValue={sp.to ?? ""} /></Field>
          <div className="flex gap-2">
            <Button type="submit">اعمال فیلتر</Button>
            <Link href="/transactions" className={buttonClass({ variant: "outline" })}>پاک‌کردن</Link>
          </div>
        </form>
      </Card>

      {items.length === 0 ? (
        <EmptyState title="تراکنشی پیدا نشد" description="با تغییر فیلترها دوباره جست‌وجو کنید یا اعتبار خود را افزایش دهید." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[40rem] text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>{["نوع", "شرح", "مبلغ", "موجودی پس از تراکنش", "تاریخ و ساعت", "وضعیت"].map((h) => <th key={h} className="px-4 py-3 text-start font-medium">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((t) => (
                <tr key={t.id}>
                  <td className="px-4 py-3 font-medium">{TX_TYPE_LABELS[t.type]}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.description}</td>
                  <td className={`px-4 py-3 ${t.type === "RESERVE" ? "text-danger" : "text-success"}`}>{t.type === "RESERVE" ? "−" : "+"}{formatToman(t.amount)}</td>
                  <td className="px-4 py-3">{formatToman(t.balanceAfter)}</td>
                  <td className="px-4 py-3">{formatDateTime(t.createdAt)}</td>
                  <td className="px-4 py-3"><Badge tone={statusTone[t.status]}>{TX_STATUS_LABELS[t.status]}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <nav aria-label="صفحه‌بندی" className="mt-6 flex items-center justify-center gap-3 text-sm">
          {page > 1 ? <Link href={href(page - 1)} className={buttonClass({ variant: "outline", size: "sm" })}>صفحه قبل</Link> : <span />}
          <span className="text-muted-foreground">صفحه {formatNumber(page)} از {formatNumber(pages)}</span>
          {page < pages ? <Link href={href(page + 1)} className={buttonClass({ variant: "outline", size: "sm" })}>صفحه بعد</Link> : <span />}
        </nav>
      )}
    </>
  );
}
