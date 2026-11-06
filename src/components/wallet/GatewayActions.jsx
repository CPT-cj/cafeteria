"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/client";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

export function GatewayActions({ authority }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function settle(success) {
    setBusy(true);
    setError("");
    const res = await api("/api/wallet/verify", { method: "POST", body: { authority, success } });
    if (!res.ok) {
      setError(res.error);
      setBusy(false);
      return;
    }
    router.replace(`/wallet?status=${success ? "success" : "failed"}`);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3">
      <Alert tone="error">{error}</Alert>
      <Button size="lg" onClick={() => settle(true)} disabled={busy}>پرداخت موفق (آزمایشی)</Button>
      <Button size="lg" variant="outline" onClick={() => settle(false)} disabled={busy}>انصراف از پرداخت</Button>
    </div>
  );
}
