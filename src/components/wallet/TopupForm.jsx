"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/client";
import { toEnglishDigits, formatToman } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Field, Input } from "@/components/ui/field";

const PRESETS = [50000, 100000, 200000, 500000];

export function TopupForm() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    const value = Number(toEnglishDigits(amount).replace(/[,٬\s]/g, ""));
    if (!Number.isInteger(value) || value <= 0) return setError("مبلغ را به‌صورت عدد وارد کنید.");
    setBusy(true);
    const res = await api("/api/wallet/topup", { method: "POST", body: { amount: value } });
    if (!res.ok) {
      setError(res.error);
      setBusy(false);
      return;
    }
    router.push(res.data.redirectUrl);
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Field label="مبلغ (تومان)">
        <Input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="numeric" placeholder="مثلاً ۱۰۰۰۰۰" required />
      </Field>
      <div className="flex flex-wrap gap-2" role="group" aria-label="مبلغ‌های پیشنهادی">
        {PRESETS.map((p) => (
          <Button key={p} variant="outline" size="sm" onClick={() => setAmount(String(p))}>{formatToman(p)}</Button>
        ))}
      </div>
      <Alert tone="error">{error}</Alert>
      <Button type="submit" size="lg" disabled={busy}>{busy ? "در حال انتقال به درگاه…" : "پرداخت و افزایش اعتبار"}</Button>
    </form>
  );
}
