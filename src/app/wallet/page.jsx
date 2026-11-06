import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageTitle, Card, CardHeader } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Badge, statusTone } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { TopupForm } from "@/components/wallet/TopupForm";
import { formatToman, formatDateTime } from "@/lib/utils";
import { TOPUP_MIN, TOPUP_MAX } from "@/services/wallet";

export const metadata = { title: "افزایش اعتبار" };
const PAY_LABELS = { SUCCESS: "موفق", PENDING: "در انتظار", FAILED: "ناموفق" };

export default async function WalletPage({ searchParams }) {
  const user = await requireUser().catch(() => null);
  if (!user) return null;
  const { status } = await searchParams;
  const [wallet, payments] = await Promise.all([
    prisma.wallet.findUnique({ where: { userId: user.id } }),
    prisma.payment.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 10 }),
  ]);

  return (
    <>
      <PageTitle title="افزایش اعتبار" subtitle="اعتبار کیف پول برای رزرو غذا استفاده می‌شود." />
      {status === "success" && <Alert tone="success" className="mb-4">پرداخت با موفقیت انجام شد و اعتبار شما افزایش یافت.</Alert>}
      {status === "failed" && <Alert tone="error" className="mb-4">پرداخت انجام نشد و مبلغی به اعتبار شما اضافه نشد.</Alert>}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-6">
          <Card>
            <p className="text-sm text-muted-foreground">موجودی فعلی</p>
            <p className="mt-2 text-3xl font-bold">{formatToman(wallet?.balance ?? 0)}</p>
          </Card>
          <Card>
            <CardHeader title="شارژ کیف پول" />
            <TopupForm />
            <p className="mt-3 text-xs text-muted-foreground">مبلغ مجاز: {formatToman(TOPUP_MIN)} تا {formatToman(TOPUP_MAX)}. در این نسخه پرداخت از طریق درگاه آزمایشی انجام می‌شود.</p>
          </Card>
        </div>
        <Card>
          <CardHeader title="تاریخچه افزایش اعتبار" />
          {payments.length === 0 ? <EmptyState title="هنوز اعتبار افزایش نداده‌اید" /> : (
            <ul className="divide-y divide-border">
              {payments.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div><p className="font-medium">{formatToman(p.amount)}</p><p className="text-xs text-muted-foreground">{formatDateTime(p.createdAt)}{p.refId ? ` · کد پیگیری ${Number(p.refId).toLocaleString("fa-IR", { useGrouping: false })}` : ""}</p></div>
                  <Badge tone={statusTone[p.status]}>{PAY_LABELS[p.status]}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
