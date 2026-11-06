"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Field, Input } from "@/components/ui/field";

export function AuthForm({ mode, next }) {
  const router = useRouter();
  const isRegister = mode === "register";
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const body = Object.fromEntries(new FormData(e.currentTarget));
    const res = await api(isRegister ? "/api/auth/register" : "/api/auth/login", { method: "POST", body });
    if (!res.ok) {
      setError(res.error);
      setBusy(false);
      return;
    }
    const safe = next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
    router.replace(safe);
    router.refresh();
  }

  return (
    <Card className="mx-auto w-full max-w-md p-6">
      <h1 className="mb-1 text-xl font-bold">{isRegister ? "ثبت‌نام در سامانه سلف" : "ورود به حساب کاربری"}</h1>
      <p className="mb-5 text-sm text-muted-foreground">{isRegister ? "برای رزرو غذا حساب دانشجویی خود را بسازید." : "شماره دانشجویی و رمز عبور خود را وارد کنید."}</p>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Field label="شماره دانشجویی"><Input name="studentNumber" inputMode="numeric" autoComplete="username" required dir="ltr" className="text-end" /></Field>
        {isRegister && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="نام"><Input name="firstName" autoComplete="given-name" required /></Field>
              <Field label="نام خانوادگی"><Input name="lastName" autoComplete="family-name" required /></Field>
            </div>
            <Field label="شماره موبایل" hint="مانند ۰۹۱۲۳۴۵۶۷۸۹"><Input name="phone" inputMode="tel" autoComplete="tel" required dir="ltr" className="text-end" /></Field>
          </>
        )}
        <Field label="رمز عبور" hint={isRegister ? "حداقل ۸ کاراکتر" : undefined}>
          <Input name="password" type="password" autoComplete={isRegister ? "new-password" : "current-password"} required minLength={isRegister ? 8 : undefined} dir="ltr" className="text-end" />
        </Field>
        <Alert tone="error">{error}</Alert>
        <Button type="submit" size="lg" disabled={busy}>{busy ? "لطفاً صبر کنید…" : isRegister ? "ثبت‌نام" : "ورود"}</Button>
      </form>
      <p className="mt-5 text-center text-sm text-muted-foreground">
        {isRegister ? "قبلاً ثبت‌نام کرده‌اید؟ " : "حساب کاربری ندارید؟ "}
        <Link href={isRegister ? "/login" : "/register"} className="font-medium text-primary hover:underline">{isRegister ? "وارد شوید" : "ثبت‌نام کنید"}</Link>
      </p>
    </Card>
  );
}
