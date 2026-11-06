import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { GatewayActions } from "@/components/wallet/GatewayActions";
import { formatToman } from "@/lib/utils";

export const metadata = { title: "درگاه پرداخت آزمایشی" };

export default async function GatewayPage({ params }) {
  const user = await requireUser().catch(() => null);
  if (!user) return null;
  const { authority } = await params;
  const payment = await prisma.payment.findUnique({ where: { authority } });
  if (!payment || payment.userId !== user.id) notFound();
  if (payment.status !== "PENDING") redirect("/wallet");

  return (
    <Card className="mx-auto max-w-md p-6">
      <h1 className="mb-1 text-xl font-bold">درگاه پرداخت آزمایشی</h1>
      <Alert tone="info" className="my-4">این درگاه فقط برای آزمایش است؛ هیچ وجه واقعی کسر نمی‌شود و با درگاه بانکی واقعی اشتباه گرفته نشود.</Alert>
      <p className="mb-6 text-sm text-muted-foreground">مبلغ قابل پرداخت: <span className="font-bold text-foreground">{formatToman(payment.amount)}</span></p>
      <GatewayActions authority={payment.authority} />
    </Card>
  );
}
